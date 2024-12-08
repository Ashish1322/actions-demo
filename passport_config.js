import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./modals/user.js";
import jwt from "jsonwebtoken";

dotenv.config();

let strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8001/api/v1/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile["emails"][0]["value"] });
      if (user == null) {
        user = await User.create({
          name: profile["displayName"],
          email: profile["emails"][0]["value"],
          password: "GOOGLE",
          active: true,
        });
      }
      // Generate Token
      const accessToken = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      done(null, { accessToken, name: user.name, email: user.email });
    } catch (err) {
      done(err);
    }
  }
);

passport.use(strategy);

export default passport;
