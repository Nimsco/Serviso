const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const imagekit = require("../config/imagekit");

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
            address
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


        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }


        if (password.length < 4) {
            return res.status(400).json({
                message: "Password must be at least 4 characters"
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

        // 🔹 ROLE SAFETY
        const finalRole = role === "provider" ? "provider" : "customer";


        let profilePicUrl = "";

        if (req.file) {
            const uploadedImage = await imagekit.upload({
                file: req.file.buffer.toString("base64"),
                fileName: Date.now() + "-" + req.file.originalname
            });

            profilePicUrl = uploadedImage.url;
        }


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
            profilePic: profilePicUrl
        };

        if (finalRole === "provider") {
            userData.providerDetails = {
                categories: [],
                experience: 0,
                hourlyRate: 0,
                isVerified: false,
                availability: []
            };
        }


        const user = await userModel.create(userData);


        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

   
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(201).json({
            message: "User registered successfully",
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

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}



async function loginUser(req, res) {
    try {
        const { username, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false
        });

        return res.status(200).json({
            message: "Logged in successfully",
            token,
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

async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax"
    });

    res.status(200).json({ message: "Logged out successfully" });
}

async function getProfile(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password");

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile
};