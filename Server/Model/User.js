const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter your Password"],
    minLength: [4, "Password Should be greater than 4 Characters"],
    select: false, //ee data client side lek edkunnendekil passwordine edkaan patilla athinaan select:false kodthirikunnath
  },
  phoneNumber: {
    type: Number,
  },
  addresses: [
    {
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      zipCode: {
        type: Number,
      },
      addressType: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    public_id: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTime: Date,
});

//modelsinte ullil functions ezhthaan patum.ath evde venelum import cheyyaathe access cheyyaan patum

//hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    //password modified chythtlenkil
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
}); //mongodb yilek store aakunnathin mump pre() work aavum

//jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

//compare password
userSchema.methods.comparePassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

module.exports = mongoose.model("User",userSchema);