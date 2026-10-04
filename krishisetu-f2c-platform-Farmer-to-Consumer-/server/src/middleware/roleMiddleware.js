const allowFarmer = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Farmers only' });
};

const allowConsumer = (req, res, next) => {
  if (req.user && req.user.role === 'consumer') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Consumers only' });
};

const allowDeliveryPartner = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Delivery partners only' });
};

const allowAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
};

const allowFarmerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'farmer' || req.user.role === 'admin')) return next();
  return res.status(403).json({ success: false, message: 'Access denied' });
};

module.exports = { allowFarmer, allowConsumer, allowDeliveryPartner, allowAdmin, allowFarmerOrAdmin };
