import express from "express";
import { body } from "express-validator";
// import controllers
import {
  login,
  signup,
  activateAccount,
  profileUpload,
} from "../controllers/auth.js";
import { validateBody, isLoggedIn } from "../middlewares/auth.js";
import upload from "../middlewares/multer-config.js";

import passport from "../passport_config.js";

const router = express.Router();

// Auth Routes
router.post(
  "/login",
  body("email").exists().isEmail().withMessage("Invalid Email"),
  validateBody,
  login
);
router.post("/signup", signup);
router.get("/activate/:token", activateAccount);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log(req.user);
    res.redirect(
      `http://localhost:5173?accessToken=${req.user.accessToken}&name=${req.user.name}&email=${req.user.email}`
    );
  }
);

router.post(
  "/upload",
  isLoggedIn,
  upload.single("profile-photo"),
  profileUpload
);

export default router;
