const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const { verifySignature } = require('../middleware/auth');
const { checkSubscription } = require('../services/subscription');

const generateNonce = () => {
  return Math.floor(Math.random() * 1000000).toString();
};

const MESSAGE_PREFIX = "Sign this message to authenticate with HODLAI\nNonce: ";

exports.getNonce = async (req, res) => {
  const { address } = req.params;
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  const nonce = generateNonce();
  req.session = req.session || {};
  req.session[address.toLowerCase()] = nonce;

  res.json({ message: `${MESSAGE_PREFIX}${nonce}` });
};

exports.verifySignature = async (req, res) => {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({ error: 'Address and signature required' });
  }

  const nonce = req.session?.[address.toLowerCase()];
  if (!nonce) {
    return res.status(400).json({ error: 'Nonce not found. Please request a new one.' });
  }

  const message = `${MESSAGE_PREFIX}${nonce}`;
  const isValid = verifySignature(message, signature, address);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  delete req.session[address.toLowerCase()];

  const subscriptionStatus = await checkSubscription(address);
  
  const token = jwt.sign(
    { 
      address: address.toLowerCase(),
      subscription: subscriptionStatus
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    subscription: subscriptionStatus
  });
};

exports.checkSubscription = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    if (req.user.address.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({ error: 'Not authorized to check this address' });
    }

    const subscriptionStatus = await checkSubscription(address);
    res.json(subscriptionStatus);
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Failed to check subscription status' });
  }
}; 