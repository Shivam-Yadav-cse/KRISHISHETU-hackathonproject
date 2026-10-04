const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, pincode, city, state } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const coordMap = {
      Maharashtra: { lat: 19.7515, lng: 75.7139 },
      Punjab: { lat: 31.1471, lng: 75.3412 },
      'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
      Gujarat: { lat: 22.2587, lng: 71.1924 },
      Karnataka: { lat: 15.3173, lng: 75.7139 },
    };
    const coordinates = coordMap[state] || { lat: 20.5937 + Math.random() * 5, lng: 78.9629 + Math.random() * 5 };
    const requestedRole = (role || 'consumer').toLowerCase();
    if (requestedRole === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin registration is not allowed. Please choose Farmer, Consumer, or Delivery Partner.' });
    }
    const user = await User.create({ name, email, password, phone, role: requestedRole, address, pincode, city, state, coordinates });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        phone: user.phone, city: user.city, state: user.state, pincode: user.pincode,
        coordinates: user.coordinates, token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id, name: user.name, email: user.email, role: user.role,
        phone: user.phone, city: user.city, state: user.state, pincode: user.pincode,
        coordinates: user.coordinates, token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, pincode, city, state } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, pincode, city, state },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
