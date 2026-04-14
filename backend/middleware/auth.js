import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded?.userId !== 'string') {
      throw new Error('Invalid token userId type');
    }
    decoded.userId = String(decoded.userId);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Generate JWT token
export const generateToken = (userId, email, username, role) => {
  if (userId === null || typeof userId === 'undefined') {
    throw new Error('Invalid userId for token generation');
  }
  const normalizedUserId = String(userId);
  if (typeof normalizedUserId !== 'string' || !normalizedUserId) {
    throw new Error('Invalid userId for token generation');
  }
  return jwt.sign(
    { userId: normalizedUserId, email, username, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const requireRole = (roles) => {
  const roleSet = new Set(Array.isArray(roles) ? roles : [roles]);
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roleSet.has(role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

export const requireAdmin = requireRole(['admin']);

// Alias for verifyToken to maintain compatibility
export const authenticateToken = verifyToken;
