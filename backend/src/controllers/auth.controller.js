const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const imagekit = require("../config/imagekit");
const sendEmail = require("../utils/sendEmail");

// ──────────────────────────────────────────────
// Helper: upload image to ImageKit
// ──────────────────────────────────────────────
async function uploadImage(file) {
    if (!file) return "";

    const uploadedImage = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: Date.now() + "-" + file.originalname
    });

    return uploadedImage.url;
}

// ──────────────────────────────────────────────
// Helper: generate & set access + refresh tokens
// Returns { accessToken } for the response body
// ──────────────────────────────────────────────
async function issueTokens(res, user) {
    // 1. Generate tokens
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "10d" }
    );

    // 2. Hash and store the refresh token in DB (for revocation)
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    user.refreshTokenExpiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    await user.save();

    // 3. Set httpOnly cookies
    const accessMaxAge = 1 * 24 * 60 * 60 * 1000;   // 1 day
    const refreshMaxAge = 10 * 24 * 60 * 60 * 1000; // 10 days

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: accessMaxAge
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: refreshMaxAge
    });

    return accessToken;
}

// ──────────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────────
async function registerUser(req, res) {
    try {
        const {
            name,
            username,
            email,
            password,
            role,
            phone,
            gender,
            dob,
            address,
            category,
            experience,
            hourlyRate,
            availability,
            bio
        } = req.body;


        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All required fields must be filled"
            });
        }

        if (username.trim().length < 4) {
            return res.status(400).json({
                message: "Username must be at least 4 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase letter and one number"
            });
        }

        const normalizedUsername = username.toLowerCase().trim();
        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await userModel.findOne({
            $or: [
                { username: normalizedUsername },
                { email: normalizedEmail }
            ]
        });

        if (userExists) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }


        const hash = await bcrypt.hash(password, 10);

        //  ROLE SAFETY
        const finalRole = role === "provider" ? "provider" : "customer";


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const isProvider = finalRole === "provider";
        const profilePicFile = req.file || req.files?.profilePic?.[0];
        const citizenshipFrontFile = req.files?.citizenshipFront?.[0];
        const citizenshipBackFile = req.files?.citizenshipBack?.[0];
        const extraDocumentFile = req.files?.extraDocument?.[0];

        if (isProvider && (!category || !citizenshipFrontFile || !citizenshipBackFile)) {
            return res.status(400).json({
                message: "Provider category and citizenship documents are required"
            });
        }

        const profilePicUrl = await uploadImage(profilePicFile);
        const citizenshipFrontUrl = await uploadImage(citizenshipFrontFile);
        const citizenshipBackUrl = await uploadImage(citizenshipBackFile);
        const extraDocumentUrl = await uploadImage(extraDocumentFile);

        let userData = {
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            password: hash,
            role: finalRole,
            phone,
            gender,
            dob,
            address,
            profilePic: profilePicUrl,
            emailVerified: false,
            emailOtp: hashedOtp,
            emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
            providerStatus: isProvider ? "email_pending" : "none",
        };

        if (finalRole === "provider") {
            userData.providerDetails = {
                categories: category ? [category] : [],
                experience: Number(experience) || 0,
                hourlyRate: Number(hourlyRate) || 0,
                isVerified: false,
                availability: availability ? availability.split(",").map((day) => day.trim()).filter(Boolean) : [],
                bio: bio || "",
                documents: {
                    citizenshipFront: citizenshipFrontUrl,
                    citizenshipBack: citizenshipBackUrl,
                    extraDocument: extraDocumentUrl
                }
            };
        }

        const user = await userModel.create(userData);

        const emailSubject = isProvider
            ? "Verify your Serviso provider application"
            : "Verify your Serviso account";
        const emailText = `Your Serviso verification code is ${otp}. It expires in 10 minutes.`;

        await sendEmail({
            to: normalizedEmail,
            subject: emailSubject,
            text: emailText
        });

        return res.status(201).json({
            message: "Verification code sent to your email",
            email: normalizedEmail,
            role: finalRole,
            requiresEmailVerification: true
        });



    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


// ──────────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────────
async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is temporarily blocked" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before logging in",
                requiresEmailVerification: true,
                email: user.email,
                role: user.role
            });
        }

        if (user.role === "provider") {
            if (user.providerStatus === "pending" || user.providerStatus === "none") {
                return res.status(403).json({
                    message: "Your provider application is waiting for admin approval"
                });
            }

            if (user.providerStatus === "rejected") {
                return res.status(403).json({
                    message: user.providerDecisionReason || "Your provider application was rejected"
                });
            }
        }

        // Issue both tokens (sets httpOnly cookies + stores hashed refresh in DB)
        const accessToken = await issueTokens(res, user);

        return res.status(200).json({
            message: "Logged in successfully",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                address: user.address,
                profilePic: user.profilePic
            }
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// ──────────────────────────────────────────────
// POST /api/auth/verify-email
// ──────────────────────────────────────────────
async function verifyEmail(req, res) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: "Email and code are required" });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        if (!user.emailOtp || !user.emailOtpExpiresAt || user.emailOtpExpiresAt < new Date()) {
            return res.status(400).json({ message: "Verification code expired" });
        }

        const validCode = await bcrypt.compare(code, user.emailOtp);

        if (!validCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        user.emailVerified = true;
        user.emailOtp = "";
        user.emailOtpExpiresAt = undefined;

        if (user.role === "provider") {
            user.providerStatus = "pending";
        }

        await user.save();

        // For customers — auto login with both tokens
        if (user.role === "customer") {
            const accessToken = await issueTokens(res, user);

            return res.json({
                message: "Email verified successfully",
                accessToken,
                autoLogin: true,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePic: user.profilePic,
                    address: user.address
                }
            });
        }

        // For providers — still needs admin approval, no tokens issued
        res.json({
            message: "Email verified. Your application has been sent to admin for approval."
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// ──────────────────────────────────────────────
// POST /api/auth/refresh
// Issues a new access token using the refresh token cookie
// ──────────────────────────────────────────────
async function refreshAccessToken(req, res) {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        // Verify the refresh token signature
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        // Find the user and validate the stored hashed token
        const user = await userModel.findById(decoded.id);

        if (!user || !user.refreshToken) {
            return res.status(401).json({ message: "Session not found. Please log in again." });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account is temporarily blocked" });
        }

        // Check if refresh token is expired in DB
        if (user.refreshTokenExpiresAt < new Date()) {
            return res.status(401).json({ message: "Refresh token expired. Please log in again." });
        }

        // Compare the incoming token to the stored hash
        const isValid = await bcrypt.compare(token, user.refreshToken);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Issue a fresh pair of tokens (rotating refresh token)
        const accessToken = await issueTokens(res, user);

        return res.status(200).json({
            message: "Token refreshed",
            accessToken
        });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// ──────────────────────────────────────────────
// POST /api/auth/logout
// ──────────────────────────────────────────────
async function logoutUser(req, res) {
    try {
        // Wipe refresh token from DB if user is identifiable via the cookie
        const token = req.cookies.refreshToken;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
                await userModel.findByIdAndUpdate(decoded.id, {
                    refreshToken: "",
                    refreshTokenExpiresAt: null
                });
            } catch {
                // Token invalid/expired — still clear cookies
            }
        }

        res.clearCookie("accessToken", { httpOnly: true, sameSite: "lax" });
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// ──────────────────────────────────────────────
// GET /api/auth/profile
// ──────────────────────────────────────────────
async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password -refreshToken -refreshTokenExpiresAt");

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    verifyEmail,
    refreshAccessToken
};
