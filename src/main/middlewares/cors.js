module.exports = (req, res, next) => {
  res.set("access-control-allow-origin", "*");
  res.set("access-control-allow-method", "*");
  res.set("access-control-allow-headers", "*");
  next();
};
