function allowCustomer(req, res, next) {
  if (req.user.role !== "customer") {
    return res.status(403).json({
      message: "Only customers can book services",
    });
  }

  next();
}

module.exports = {
  allowCustomer,
};
