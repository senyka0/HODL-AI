const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [user] = await User.findOrCreate({
      where: { address: decoded.address.toLowerCase() }
    });

    req.user = { ...decoded, id: user.id };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const verifySignature = (message, signature, address) => {
  try {
    const signerAddr = ethers.verifyMessage(message, signature);
    return signerAddr.toLowerCase() === address.toLowerCase();
  } catch {
    return false;
  }
};

module.exports = { verifyToken, verifySignature }; 