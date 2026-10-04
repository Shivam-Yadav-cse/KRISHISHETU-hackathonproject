[README.md](https://github.com/user-attachments/files/33035012/README.md)
# 🌾 KrishiSetu — Direct Farmer-to-Consumer Digital Marketplace

> **Hackathon-Ready MERN Stack Application**
> Empowering farmers. Feeding communities. Removing middlemen.

---

## ✅ Features

- **Role-Based Access** — Farmer, Consumer, Delivery Partner, Admin
- **Smart Pricing** — Rule-based price recommendation using mock mandi data
- **Live Mandi Ticker** — Simulated real-time crop price feed
- **Escrow Payments** — Stripe integration with escrow workflow
- **Real-time Tracking** — Socket.IO live order tracking + Leaflet maps
- **Voice Input** — Web Speech API for Hindi/English product
- **Dark Mode** — Full dark mode support
- **Wishlist** — Consumer product wishlist
- **Analytics** — Recharts dashboards for all roles
- **Pincode Marketplace** — Hyperlocal farmer discovery
- **Notifications** — Real-time notification system

---

## 🛠 Tech Stack

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO
- Stripe (TEST MODE)
- Multer (image uploads)
- Helmet + Rate Limiting

### Frontend

- React 18 + Vite
- Tailwind CSS
- React Router DOM v6
- React Query via Axios
- Socket.IO Client
- React Leaflet + Leaflet.js
- Recharts
- Framer Motion
- react-i18next
- react-hook-form

---

## 📁 Project Structure

```
KRISHISETU/
├── client/          # React + Vite Frontend
│   └── src/
│       ├── pages/   # All page components
│       ├── components/  # Reusable UI components
│       ├── context/ # Auth, Cart, Socket, Theme
│       ├── services/api.js  # Axios API service
│       └── locales/ # en.json, hi.json
├── server/          # Express.js Backend
│   └── src/
│       ├── models/  # Mongoose schemas
│       ├── controllers/  # Business logic
│       ├── routes/  # API endpoints
│       ├── middleware/  # Auth, Role, Error
│       ├── utils/   # Mandi data, Price AI
│       ├── sockets/ # Socket.IO handler
│       └── seed/    # Database seeder
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| POST   | /api/auth/register             | Register user           |
| POST   | /api/auth/login                | Login                   |
| GET    | /api/products                  | Get all products        |
| POST   | /api/products                  | Create product (farmer) |
| GET    | /api/cart                      | Get cart (consumer)     |
| POST   | /api/orders                    | Place order             |
| PUT    | /api/orders/:id/release-escrow | Release payment         |
| GET    | /api/admin/stats               | Admin analytics         |
| GET    | /api/payment/mandi-prices      | Live mandi prices       |

---

## 💰 Stripe Test Cards

| Card    | Number              |
| ------- | ------------------- |
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |

Use any future expiry date and any 3-digit CVV.

---

## 🌍 Deployment

- **Frontend**: Deploy `client/` to Vercel — set `VITE_API_URL` to your backend URL
- **Backend**: Deploy `server/` to Render — set all env variables in dashboard

---

Built with ❤️ for Hackathon — KrishiSetu © 2026
