import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
function isLoggedIn(req, res, next) {
  let token = req.headers.authorization;
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    req.authUser = data;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid Access Token" });
  }
}

function validateBody(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else {
    return res
      .status(400)
      .json({ success: false, message: result["errors"][0]["msg"] });
  }
}

export { isLoggedIn, validateBody };
