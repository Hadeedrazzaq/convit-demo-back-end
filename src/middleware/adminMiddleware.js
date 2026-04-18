function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  res.status(403);
  throw new Error('Admin access required');
}

module.exports = { checkAdmin };
