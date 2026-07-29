const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// Protect routes — reads the short-lived accessToken cookie
async function protect(req, res, next) {
    try {
        const token =
            req.cookies.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const user = await userModel
            .findById(decoded.id)
            .select("-password -refreshToken -refreshTokenExpiresAt");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is temporarily blocked" });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
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