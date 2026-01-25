// import mongoose from "mongoose";

// const MarkSchema = new mongoose.Schema(
//   {
//     examId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Exam",
//       required: true,
//     },
//     marks: [
//       {
//         subjectId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Subject",
//         },
//         studentId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         // examscore: { type: Number, required: true },
//         // testscore: { type: Number, required: true },
//         // marksObtained: { type: Number, required: true },
//          testscore: { type: Number, required: true, default: 0 },
//   examscore: { type: Number, required: true, default: 0 },
//   marksObtained: { type: Number, required: true, default: 0 },
//         comment: { type: String },
//       },
//     ],
//     session: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Session", // Reference to the Session model
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// export default mongoose.model("Mark", MarkSchema);
import mongoose from "mongoose";

const MarkSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    marks: [
      {
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },

        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        testscore: {
          type: Number,
          default: 0,
          required: true,
          set: v => (v == null ? 0 : v),
        },

        examscore: {
          type: Number,
          default: 0,
          required: true,
          set: v => (v == null ? 0 : v),
        },

        marksObtained: {
          type: Number,
          required: true,
          default: 0,
          set: v => (v == null ? 0 : v),
        },

        comment: {
          type: String,
          default: "",
        },
      },
    ],

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * 🔥 Auto-recalculate marksObtained before save
 * This guarantees consistency forever.
 */
MarkSchema.pre("validate", function (next) {
  if (Array.isArray(this.marks)) {
    this.marks.forEach(mark => {
      mark.testscore = mark.testscore ?? 0;
      mark.examscore = mark.examscore ?? 0;
      mark.marksObtained = mark.testscore + mark.examscore;
    });
  }
  next();
});

export default mongoose.model("Mark", MarkSchema);
