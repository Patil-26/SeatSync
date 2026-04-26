import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid Indian phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["passenger", "driver", "admin"],
      default: "passenger",
    },
    avatar: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    isPro: { type: Boolean, default: false },
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRidesAsPassenger: { type: Number, default: 0 },
    totalRidesAsDriver: { type: Number, default: 0 },
    totalCO2Saved: { type: Number, default: 0 },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
