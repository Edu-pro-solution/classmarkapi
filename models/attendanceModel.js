import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    className: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    status: { type: String, enum: ["present", "absent", "late"], default: "present" },
    checkInTime: { type: Date },
    notified: { type: Boolean, default: false },
    notificationStatus: {
      type: String,
      enum: ["sent", "failed", "skipped", "pending"],
      default: "pending",
    },
    notificationError: { type: String },
  },
  { timestamps: true }
);

// One attendance record per student per session per day
attendanceSchema.index({ student: 1, session: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);