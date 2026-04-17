function notFound(req, res, next) {
  const err = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(err);
}

function errorHandler(err, req, res, _next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
