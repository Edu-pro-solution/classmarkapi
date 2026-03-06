import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ROLES = ["academic", "student", "researcher", "institution", "professional"];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: `Role must be one of: ${ROLES.join(", ")}`,
      },
      required: [true, "Role is required"],
    },
    referralCode: {
      type: String,
      trim: true,
      default: null,
    },
    // Track who referred this user (resolved from referralCode)
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchUser",
      default: null,
    },
    // Each user gets their own unique referral code to share
    myReferralCode: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate a unique referral code for the new user before saving
userSchema.pre("save", async function (next) {
  // Hash password only if modified
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Assign a unique referral code if not already set
  if (!this.myReferralCode) {
    this.myReferralCode = generateReferralCode(this.username);
  }

  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function generateReferralCode(username) {
  const prefix = username.slice(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, "X");
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${suffix}`;
}

const User = mongoose.model("SchUser", userSchema);
export default User;
