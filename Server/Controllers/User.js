const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { upload } = require("../multer");
const ErrorHandler = require("../Utils/ErrorHandler");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../Utils/SendMail");
const catchAsyncError = require("../Middleware/catchAsyncError");
const { isNumberObject } = require("util/types");
const sendToken = require("../utils/jwtToken");

router
  .route("/create-user")
  .post(upload.single("file"), async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const userEmail = await User.findOne({ email });
      if (userEmail) {
        const filenName = req.file.filename;
        const filePath = `uploads/${filenName}`;
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(error);
            res.status(500).json({ message: "Error Deleting File" });
          }
        });

        return next(new ErrorHandler("User already exists", 400));
      }

      const fileName = req.file.filename;
      const fileUrl = path.join(fileName);

      const user = {
        name,
        email,
        password,
        avatar: {
          public_id: fileUrl,
          url: fileUrl,
        },
      };

      // const newUser = await User.create(user);

      const activationToken = createActivationToken(user);
      // console.log(activationToken);
      const activationUrl = `http://localhost:5173/activation/${activationToken}`;

      //send email
      try {
        await sendMail({
          email: user.email,
          subject: "Activate Your Account",
          message: `Hello ${user.name} Please click on the link to activate your account: ${activationUrl}`,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  });

//function to create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      console.log(activation_token);
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );
      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({ name, email, password, avatar });
      sendToken(user, 201, res);
      console.log(newUser);
      console.log(user);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
