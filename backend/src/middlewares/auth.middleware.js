const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// Protect routes
async function protect(req, res, next) {
    try {
        const token =
            req.cookies.token ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// Role-based access
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
}

function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }
  next();
}



module.exports = {
    protect,
    authorizeRoles,
    admin,
};