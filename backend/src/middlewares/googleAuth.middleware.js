const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/user.model");

async function buildUsername(profile) {
  const emailName = profile.emails?.[0]?.value?.split("@")[0] || "";
  const displayName = profile.displayName || "google-user";
  const base = (emailName || displayName)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 20) || "googleuser";

  let username = `${base}${profile.id.slice(-6)}`;
  let suffix = 1;

  while (await userModel.exists({ username })) {
    username = `${base}${profile.id.slice(-6)}${suffix}`;
    suffix += 1;
  }

  return username;
}

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();

      if (!email) {
        return done(null, false, { message: "No email returned from Google" });
      }

      // Check if user already exists
      let user = await userModel.findOne({
        $or: [
          { email },
          { googleId: profile.id }
        ]
      });

      if (user) {
        // User already exists, just update the Google ID if needed
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // Create new user
      const newUser = new userModel({
        name: profile.displayName,
        username: await buildUsername(profile),
        email,
        googleId: profile.id,
        role: "customer",
        emailVerified: true,
        providerStatus: "none",
        profilePic: profile.photos?.[0]?.value || ""
      });

      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;
