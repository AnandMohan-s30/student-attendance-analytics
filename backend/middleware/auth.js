/**
 * JWT authentication middleware.
 * Reads the token from the HttpOnly cookie `token`.
 * On success, attaches { id, name, email, role } to req.user.
 */
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, name: payload.name, email: payload.email, role: payload.role };
    next();
  } catch {
    // Clear the stale cookie so the browser stops sending it
    res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
    return res.status(401).json({ error: 'Session expired – please log in again' });
  }
};
