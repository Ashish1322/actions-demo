import User from "../modals/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

async function login(req, res) {
  const { email, password } = req.body;
  try {
    // 1. user should be there with this email
    const existingUser = await User.findOne({ email: email });
    if (existingUser == null) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email",
      });
    }
    // 2. check if account is active or not
    if (existingUser.active == false) {
      return res.status(400).json({
        success: false,
        message:
          "Your account is not active, please click on the link sent on your email to active your account!",
      });
    }
    // 3. compare the password
    const compare = await bcrypt.compare(password, existingUser.password);
    if (compare == true) {
      // 4. User id and password is correct so sign one access token for the user
      const accessToken = jwt.sign(
        {
          userId: existingUser._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        success: true,
        message: "Login Success",
        user: {
          accessToken: accessToken,
          name: existingUser.name,
          email: existingUser.email,
          profilePic: existingUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
}

async function signup(req, res) {
  const { name, email, password } = req.body;

  try {
    // 1. Check if the email is already existing
    const existingUser = await User.findOne({ email: email });
    if (existingUser != null) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with given email",
      });
    }

    // 2. Check for password strong
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please provide a strong password min : 8length",
      });
    }
    // 3. Gen Salt
    const salt = await bcrypt.genSalt(10);
    // 4. Hash the password of user with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Add the user in db
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    // 5. Send one Email Activation Link to User
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "a.m2001nov@gmail.com", // 1. Make sure 2 step verificaiton is on, 2. Generate a App password
        pass: "jitzqfvttddnayez",
      },
    });
    // generate one token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_KEY
    );

    await transporter.sendMail({
      from: "a.m2001nov@gmail.com",
      to: email,
      subject: "Welcom to TodoApp. Please Activate your Account !",
      text: `
            Welcome ${name}!
            Thanks for signing up.
            Please click on the follwoing link to activate your account

            Link: http://localhost:8001/api/v1/auth/activate/${token}
        `,
    });
    return res
      .status(200)
      .json({ success: true, message: "Account created successfully" });


  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
}

async function activateAccount(req, res) {
  const { token } = req.params;
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    await User.findByIdAndUpdate(data.userId, {
      active: true,
    });
    res.status(200).json({ success: true, message: "Account Activated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err });
  }
}

async function profileUpload(req, res) {
  if (req.file) {
    const { location } = req.file;
    await User.findByIdAndUpdate(req.authUser.userId, {
      profilePic: location,
    });
    res
      .status(200)
      .json({ success: true, message: "File is uploaded", location: location });
  } else
    res.status(400).json({ success: false, message: "Failed to upload file" });
}

export { login, signup, activateAccount, profileUpload };
