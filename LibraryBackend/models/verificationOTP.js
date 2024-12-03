const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Defining Schema
const verificationOTPSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Registration",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

// this will execute before saving verificationOTPSchema
// normal function will pass here, instead of aero function
verificationOTPSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    const hash = await bcrypt.hash(this.token, 8);
    this.token = hash;
  }
  next();
});

// compare token in signin form
verificationOTPSchema.method.compareToken = async function (userProvidedToken) {
  const result = await bcrypt.compareSync(userProvidedToken, this.token);
  return result;
};

// Model
mongoose.model("VerificationOTP", verificationOTPSchema);
