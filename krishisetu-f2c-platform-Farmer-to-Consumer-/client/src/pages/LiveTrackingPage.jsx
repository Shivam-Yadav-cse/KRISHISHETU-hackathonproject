import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { orderAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useTranslation } from 'react-i18next';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUSES = ['Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'];

const deliveryIcon = L.divIcon({
  html: '<div style="background:#16a34a;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🚴</div>',
  className: '', iconSize: [32, 32], iconAnchor: [16, 16]
});

const homeIcon = L.divIcon({
  html: '<div style="background:#ef4444;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;">🏠</div>',
  className: '', iconSize: [32, 32], iconAnchor: [16, 16]
});

export default function LiveTrackingPage() {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const { socket, joinOrderRoom } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    orderAPI.getById(orderId).then(res => { setOrder(res.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!socket || !orderId) return;
    joinOrderRoom(orderId);
    socket.on('location_update', (data) => {
      if (data.orderId === orderId) setDeliveryLocation(data.coordinates);
    });
    socket.on('order_update', (data) => {
      if (data.orderId === orderId) setOrder(o => ({ ...o, deliveryStatus: data.status }));
    });
    return () => { socket.off('location_update'); socket.off('order_update'); };
  }, [socket, orderId]);

  // MOCK LIVE TRACKING FOR HACKATHON DEMO
  const startMockTracking = () => {
    setIsLive(true);
    if (socket) socket.emit('start_tracking', { orderId });
  };

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  const currentStatusIdx = STATUSES.indexOf(order.deliveryStatus);
  const mapCenter = deliveryLocation || order.farmer?.coordinates || { lat: 19.076, lng: 72.877 };
  const consumerCoords = order.customer?.coordinates || { lat: 19.080, lng: 72.880 };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/my-orders" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 text-sm">
        <FaArrowLeft />{t('common.back')}
      </Link>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('tracking.title')}</h1>
          <p className="text-gray-500 text-sm">Order #{order._id?.slice(-6).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.deliveryStatus} />
          {!isLive && order.deliveryStatus !== 'Delivered' && (
            <button onClick={startMockTracking} className="btn-primary text-sm py-2">▶ Start Live Tracking</button>
          )}
          {isLive && <span className="flex items-center gap-1 text-green-600 text-sm font-medium"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Live</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 lg:h-96 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {deliveryLocation && <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}><Popup>Delivery Partner</Popup></Marker>}
            <Marker position={[consumerCoords.lat, consumerCoords.lng]} icon={homeIcon}><Popup>Your Location</Popup></Marker>
            {deliveryLocation && <Polyline positions={[[deliveryLocation.lat, deliveryLocation.lng], [consumerCoords.lat, consumerCoords.lng]]} color="#16a34a" dashArray="8 4" />}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-4">Delivery Progress</h2>
            <div className="space-y-3">
              {STATUSES.map((status, idx) => {
                const done = idx <= currentStatusIdx;
                const active = idx === currentStatusIdx;
                return (
                  <div key={status} className={`flex items-center gap-3 ${done ? 'opacity-100' : 'opacity-40'}`}>
                    {done ? (
                      <FaCheckCircle className={`text-xl ${active ? 'text-green-500 animate-pulse' : 'text-green-500'}`} />
                    ) : (
                      <FaCircle className="text-xl text-gray-300" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${active ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>{status}</p>
                      {active && <p className="text-xs text-green-500">Current Status</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3">Order Items</h2>
            {order.products?.map((p, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span className="text-gray-600 dark:text-gray-400">{p.name} ×{p.quantity}</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{p.price * p.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 flex justify-between font-bold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>

          {order.trackingUpdates && order.trackingUpdates.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 dark:text-white mb-3">Updates</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {[...order.trackingUpdates].reverse().map((u, i) => (
                  <div key={i} className="text-xs border-l-2 border-green-500 pl-3">
                    <p className="font-medium text-gray-700 dark:text-gray-300">{u.status}</p>
                    <p className="text-gray-400">{u.note}</p>
                    <p className="text-gray-300">{new Date(u.timestamp).toLocaleTimeString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
