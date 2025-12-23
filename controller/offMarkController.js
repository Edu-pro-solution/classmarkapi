// import mongoose from "mongoose";
// import Mark from "../models/markModel.js";
// import Exam from "../models/examModel.js";
// import Session from "../models/sessionModel.js";

// // export const saveMark = async (req, res) => {
// //   const { sessionId } = req.params;

// //   try {
// //     const { examId, subjectId, updates } = req.body;
// //     console.log("Received in saveMark controller:", req.body);

// //     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
// //       return res.status(400).json({ error: "Invalid session ID" });
// //     }

// //     // Check if updates array is present in the request body
// //     if (!updates || !Array.isArray(updates)) {
// //       return res
// //         .status(400)
// //         .json({ message: "Invalid or missing updates array" });
// //     }

// //     // Fetch existing marks for the specified exam and subject
// //     const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

// //     // If existing marks are not found or the array is empty, proceed to create new marks
// //     if (!existingMarks || existingMarks.marks.length === 0) {
// //       // Save marks to the database using the provided examId and subjectId
// //       const savedMarks = await Mark.create({
// //         examId,
// //         subjectId,
// //         session: sessionId,
// //         marks: await Promise.all(
// //           updates.map(async (mark) => {
// //             const { studentId, testscore, examscore, marksObtained, comment } =
// //               mark;

// //             return {
// //               studentId,
// //               subjectId: subjectId, // Add subjectId
// //               testscore,
// //               examscore,
// //               marksObtained,
// //               comment,
// //             };
// //           })
// //         ),
// //       });
// //       console.log("Saved marks:", savedMarks);

// //       return res.status(201).json({
// //         message: "Marks saved successfully",
// //         savedMarks,
// //       });
// //     }

// //     // If existing marks are found, update the marks
// //     existingMarks.marks.forEach((existingMark) => {
// //       const update = updates.find(
// //         (mark) => mark.studentId === existingMark.studentId
// //       );

// //       if (update) {
// //         existingMark.testscore = update.testscore;
// //         existingMark.examscore = update.examscore;
// //         existingMark.marksObtained = update.marksObtained;
// //         existingMark.comment = update.comment;
// //       }
// //     });

// //     await existingMarks.save();

// //     res.status(200).json({
// //       message: "Marks updated successfully",
// //       updatedMarks: existingMarks,
// //     });
// //   } catch (error) {
// //     console.error("Error saving/updating marks:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // Importing necessary modules

// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;
//     console.log("Received in saveMark controller:", req.body);

//     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//       return res.status(400).json({ error: "Invalid session ID" });
//     }

//     if (!updates || !Array.isArray(updates)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing updates array" });
//     }

//     // Fetch existing marks for the specified exam and subject
//     const existingMarks = await Mark.findOne({
//       examId,
//       subjectId,
//       session: sessionId,
//     });

//     if (!existingMarks || existingMarks.marks.length === 0) {
//       // Save marks if not found
//       const savedMarks = await Mark.create({
//         examId,
//         subjectId,
//         session: sessionId,
//         marks: await Promise.all(
//           updates.map(async (mark) => {
//             const { studentId, testscore, examscore, marksObtained, comment } =
//               mark;

//             return {
//               studentId,
//               subjectId,
//               testscore,
//               examscore,
//               marksObtained,
//               comment,
//             };
//           })
//         ),
//       });
//       console.log("Saved marks:", savedMarks);

//       return res.status(201).json({
//         message: "Marks saved successfully",
//         savedMarks,
//       });
//     }

//     // If marks exist, update the marks for each student
//     existingMarks.marks.forEach((existingMark) => {
//       const update = updates.find(
//         (mark) => mark.studentId === existingMark.studentId
//       );

//       if (update) {
//         existingMark.testscore = update.testscore;
//         existingMark.examscore = update.examscore;
//         existingMark.marksObtained = update.marksObtained;
//         existingMark.comment = update.comment;
//       }
//     });

//     await existingMarks.save();

//     res.status(200).json({
//       message: "Marks updated successfully",
//       updatedMarks: existingMarks,
//     });
//   } catch (error) {
//     console.error("Error saving/updating marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMark = async (req, res) => {
//   try {
//     const { examName, sessionId } = req.params;

//     // Fetch the exam based on the provided examName
//     const fetchedExam = await Exam.findOne({ name: examName });

//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     if (!fetchedExam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     // Fetch the marks based on the ObjectId of the fetched exam
//     const marks = await Mark.find({
//       examId: fetchedExam._id,
//       session: sessionObjectId,
//     });

//     if (marks.length === 0) {
//       return res.status(404).json({ message: "Marks not found" });
//     }

//     // Ensure each mark has the subjectId populated
//     const scores = marks.map((mark) => ({
//       subjectId: mark.subjectId, // Make sure subjectId is set in your schema
//       ...mark.toObject(),
//     }));

//     res.status(200).json({ examId: fetchedExam._id, scores });
//   } catch (error) {
//     console.error("Error fetching marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const userId = req.params.studentId; // Assuming the studentId is passed as a parameter in the URL

// //     // Fetch marks for the specified student and populate the necessary fields
// //     const marks = await Mark.find({ "marks.studentId": userId })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     // Ensure each mark has the examId and subjectId populated
// //     const scores = marks.flatMap((mark) =>
// //       mark.marks
// //         .filter((m) => m.studentId.toString() === userId)
// //         .map((m) => ({
// //           examId: mark.examId,
// //           subjectId: m.subjectId,
// //           examName: mark.examId.name,
// //           subjectName: m.subjectId.name,
// //           testscore: m.testscore,
// //           ...m.toObject(),
// //         }))
// //     );

// //     res.status(200).json({ studentId: userId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const userId = req.params.studentId;

// //     const marks = await Mark.find({ "marks.studentId": userId })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     // const scores = marks.flatMap((mark) =>
// //     //   mark.marks
// //     //     .filter(
// //     //       (m) =>
// //     //         m.studentId.toString() === userId &&
// //     //         (m.testscore !== 0 || m.examscore !== 0) &&
// //     //         m.comment.trim() !== ""
// //     //     )
// //     //     .map((m) => ({
// //     //       examId: mark.examId,
// //     //       subjectId: m.subjectId,
// //     //       examName: mark.examId.name,
// //     //       subjectName: m.subjectId.name,
// //     //       testscore: m.testscore,
// //     //       ...m.toObject(),
// //     //     }))
// //     // );
// //     // const scores = marks.flatMap((mark) =>
// //     //   mark.marks
// //     //     .filter(
// //     //       (m) =>
// //     //         m.studentId.toString() === userId &&
// //     //         (m.testscore !== 0 || m.examscore !== 0) &&
// //     //         m.comment.trim() !== ""
// //     //     )
// //     //     .map((m) => ({
// //     //       examId: mark.examId,
// //     //       subjectId: m.subjectId,
// //     //       examName: mark.examId?.name || "Unknown Exam",
// //     //       subjectName: m.subjectId?.name || "Unknown Subject",
// //     //       testscore: m.testscore,
// //     //       ...m.toObject(),
// //     //     }))
// //     // );
// //     const scores = marks.flatMap((mark) =>
// //       mark.marks
// //         .filter(
// //           (m) =>
// //             m.studentId.toString() === userId &&
// //             (m.testscore !== 0 || m.examscore !== 0) &&
// //             m.comment.trim() !== "" &&
// //             mark.examId &&
// //             m.subjectId
// //         )
// //         .map((m) => ({
// //           examId: mark.examId,
// //           subjectId: m.subjectId,
// //           examName: mark.examId.name,
// //           subjectName: m.subjectId.name,
// //           testscore: m.testscore,
// //           ...m.toObject(),
// //         }))
// //     );

// //     res.status(200).json({ studentId: userId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionObjectId,
// //     })
// //       .populate("examId", "name")
// //       .populate("marks.subjectId", "name");

// //     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

// //     const scores = marks.flatMap(
// //       (mark) =>
// //         mark.marks
// //           .filter(
// //             (m) =>
// //               m.studentId.toString() === studentId &&
// //               (m.testscore !== 0 || m.examscore !== 0) &&
// //               m.comment.trim() !== "" &&
// //               mark.examId &&
// //               m.subjectId
// //           )
// //           .map((m) => {
// //             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
// //             // Check if subject ID exists in the Map
// //             if (!uniqueSubjects.has(subjectKey)) {
// //               // If subject doesn't exist, add it to the Map and return the mapped object
// //               uniqueSubjects.set(subjectKey, true);
// //               return {
// //                 examId: mark.examId,
// //                 subjectId: m.subjectId,
// //                 examName: mark.examId.name,
// //                 subjectName: m.subjectId.name,
// //                 testscore: m.testscore,
// //                 ...m.toObject(),
// //               };
// //             }
// //             return null; // If subject exists, return null (to filter it out)
// //           })
// //           .filter((m) => m !== null) // Filter out null values
// //     );

// //     res.status(200).json({ studentId: studentId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// // export const getMarkbyStudent = async (req, res) => {
// //   try {
// //     const { studentId, sessionId } = req.params;

// //     // Fetch marks where the session matches
// //     const marks = await Mark.find({
// //       "marks.studentId": studentId,
// //       session: sessionId,
// //     })
// //       .populate("examId", "name") // Populate exam details
// //       .populate("marks.subjectId", "name"); // Populate subject details

// //     if (!marks || marks.length === 0) {
// //       return res
// //         .status(404)
// //         .json({ message: "No marks found for the student." });
// //     }

// //     // Filter and map marks to include only data for the specified student
// //     const scores = marks.map((mark) => ({
// //       examId: mark.examId?._id,
// //       examName: mark.examId?.name,
// //       subjects: mark.marks
// //         .filter((m) => m.studentId.toString() === studentId) // Filter for this student only
// //         .map((m) => ({
// //           testScore: m.testscore,
// //           examScore: m.examscore,
// //           comment: m.comment,
// //           subjectId: m.subjectId?._id,
// //           subjectName: m.subjectId?.name,
// //         })),
// //     }));

// //     res.status(200).json({ studentId, sessionId, scores });
// //   } catch (error) {
// //     console.error("Error fetching marks for student:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     // Querying with "session" field instead of "sessionId"
//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId, // Corrected to match the field in your database
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     console.log("Marks found:", marks); // Log what is being returned

//     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

//     const scores = marks.flatMap(
//       (mark) =>
//         mark.marks
//           .filter(
//             (m) =>
//               m.studentId.toString() === studentId &&
//               (m.testscore !== 0 || m.examscore !== 0) &&
//               m.comment.trim() !== "" &&
//               mark.examId &&
//               m.subjectId
//           )
//           .map((m) => {
//             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
//             // Check if subject ID exists in the Map
//             if (!uniqueSubjects.has(subjectKey)) {
//               // If subject doesn't exist, add it to the Map and return the mapped object
//               uniqueSubjects.set(subjectKey, true);
//               return {
//                 examId: mark.examId,
//                 subjectId: m.subjectId,
//                 examName: mark.examId.name,
//                 subjectName: m.subjectId.name,
//                 testscore: m.testscore,
//                 ...m.toObject(),
//               };
//             }
//             return null; // If subject exists, return null (to filter it out)
//           })
//           .filter((m) => m !== null) // Filter out null values
//     );

//     res.status(200).json({ studentId, sessionId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMarkbyStudentwithoutsession = async (req, res) => {
//   try {
//     const userId = req.params.studentId;

//     const marks = await Mark.find({ "marks.studentId": userId })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

//     const scores = marks.flatMap(
//       (mark) =>
//         mark.marks
//           .filter(
//             (m) =>
//               m.studentId.toString() === userId &&
//               (m.testscore !== 0 || m.examscore !== 0) &&
//               m.comment.trim() !== "" &&
//               mark.examId &&
//               m.subjectId
//           )
//           .map((m) => {
//             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
//             // Check if subject ID exists in the Map
//             if (!uniqueSubjects.has(subjectKey)) {
//               // If subject doesn't exist, add it to the Map and return the mapped object
//               uniqueSubjects.set(subjectKey, true);
//               return {
//                 examId: mark.examId,
//                 subjectId: m.subjectId,
//                 examName: mark.examId.name,
//                 subjectName: m.subjectId.name,
//                 testscore: m.testscore,
//                 ...m.toObject(),
//               };
//             }
//             return null; // If subject exists, return null (to filter it out)
//           })
//           .filter((m) => m !== null) // Filter out null values
//     );

//     res.status(200).json({ studentId: userId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId } = req.params;

// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);

// //     if (!isExamIdValid && !isSubjectIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for both examId and subjectId",
// //       });
// //     }

// //     const marks = await Mark.findOne({
// //       examId: isExamIdValid ? mongoose.Types.ObjectId(examId) : null,
// //       "marks.subjectId": isSubjectIdValid
// //         ? mongoose.Types.ObjectId(subjectId)
// //         : null,
// //     });

// //     if (!marks) {
// //       return res.status(200).json({ examId, subjectId, scores: [] });
// //     }

// //     // Populate the studentId field to get the student details
// //     await Mark.populate(marks, {
// //       path: "marks.studentId",
// //       select: "studentName",
// //     });

// //     // Extract relevant information for response
// //     const scores = marks.marks.map((m) => ({
// //       studentId: m.studentId,
// //       studentName: m.studentId ? m.studentId.studentName : null,
// //       testscore: m.testscore,
// //       examscore: m.examscore,
// //       marksObtained: m.testscore + m.examscore,
// //       comment: m.comment,
// //     }));

// //     res.status(200).json({ examId, subjectId, scores });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// //       });
// //     }

// //     const marks = await Mark.findOne({
// //       examId: mongoose.Types.ObjectId(examId),
// //       session: mongoose.Types.ObjectId(sessionId),
// //       // "marks.subjectId": mongoose.Types.ObjectId(subjectId),
// //       marks: {
// //         $elemMatch: { subjectId: mongoose.Types.ObjectId(subjectId) },
// //       },
// //     });

// //     if (!marks) {
// //       return res.status(200).json({ examId, subjectId, sessionId, scores: [] });
// //     }

// //     await Mark.populate(marks, {
// //       path: "marks.studentId",
// //       select: "studentName",
// //     });

// //     const scores = marks.marks
// //       .filter((m) => m.subjectId.toString() === subjectId)
// //       .map((m) => ({
// //         studentId: m.studentId,
// //         studentName: m.studentId ? m.studentId.studentName : null,
// //         testscore: m.testscore,
// //         examscore: m.examscore,
// //         marksObtained: m.testscore + m.examscore,
// //         comment: m.comment,
// //       }));

// //     res.status(200).json({ examId, subjectId, sessionId, scores });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     // Validate ObjectIds
// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// //       });
// //     }

// //     // Find mark document for the exam & session that contains the subject
// //     const marks = await Mark.findOne({
// //       examId: mongoose.Types.ObjectId(examId),
// //       session: mongoose.Types.ObjectId(sessionId),
// //       marks: {
// //         $elemMatch: { subjectId: mongoose.Types.ObjectId(subjectId) },
// //       },
// //     });

// //     if (!marks) {
// //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// //     }

// //     // Populate student names in the marks
// //     await Mark.populate(marks, {
// //       path: "marks.studentId",
// //       select: "studentName",
// //     });

// //     // Add marksObtained = testscore + examscore to each mark
// //     const filteredMarks = marks.marks
// //       .filter((m) => m.subjectId.toString() === subjectId)
// //       .map((m) => ({
// //         _id: m._id,
// //         studentId: m.studentId._id,
// //         studentName: m.studentId.studentName,
// //         subjectId: m.subjectId,
// //         testscore: m.testscore,
// //         examscore: m.examscore,
// //         marksObtained: m.testscore + m.examscore,
// //         comment: m.comment,
// //       }));

// //     // Final structured response
// //     res.status(200).json({
// //       _id: marks._id,
// //       examId: marks.examId,
// //       session: marks.session,
// //       marks: filteredMarks,
// //       createdAt: marks.createdAt,
// //       updatedAt: marks.updatedAt,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     // Validate ObjectIds
// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// //       });
// //     }

// //     // Find mark document for the exam & session that contains the subject
// //     const marks = await Mark.findOne({
// //       examId: mongoose.Types.ObjectId(examId),
// //       session: mongoose.Types.ObjectId(sessionId),
// //       marks: {
// //         $elemMatch: { subjectId: mongoose.Types.ObjectId(subjectId) },
// //       },
// //     });

// //     if (!marks) {
// //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// //     }

// //     // Populate student names in the marks
// //     await Mark.populate(marks, {
// //       path: "marks.studentId",
// //       select: "studentName",
// //     });

// //     // Add marksObtained = testscore + examscore to each mark
// //     const filteredMarks = marks.marks
// //       .filter((m) => m.subjectId.toString() === subjectId)
// //       .map((m) => ({
// //         _id: m._id,
// //         studentId: m.studentId._id,
// //         studentName: m.studentId.studentName,
// //         subjectId: m.subjectId,
// //         testscore: m.testscore,
// //         examscore: m.examscore,
// //         marksObtained: m.testscore + m.examscore,
// //         comment: m.comment,
// //       }));

// //     res.status(200).json({
// //       _id: marks._id,
// //       examId: marks.examId,
// //       session: marks.session,
// //       marks: filteredMarks,
// //       createdAt: marks.createdAt,
// //       updatedAt: marks.updatedAt,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };

// // export const getScores = async (req, res) => {
// //   try {
// //     const { examId, subjectId, sessionId } = req.params;

// //     // Validate ObjectIds
// //     const isExamIdValid = mongoose.isValidObjectId(examId);
// //     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
// //     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

// //     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
// //       return res.status(400).json({
// //         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
// //       });
// //     }

// //     // Find all marks documents that match the examId, subjectId, and sessionId
// //     const marks = await Mark.find({
// //       examId: mongoose.Types.ObjectId(examId),
// //       session: mongoose.Types.ObjectId(sessionId),
// //       "marks.subjectId": mongoose.Types.ObjectId(subjectId),
// //     });

// //     if (!marks || marks.length === 0) {
// //       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
// //     }

// //     // Flatten the marks array
// //     let filteredMarks = [];

// //     // Loop through each mark document
// //     for (let mark of marks) {
// //       // Filter and populate student names in the marks array
// //       await Mark.populate(mark, {
// //         path: "marks.studentId",
// //         select: "studentName",
// //       });

// //       const subjectMarks = mark.marks
// //         .filter((m) => m.subjectId.toString() === subjectId)
// //         .map((m) => ({
// //           _id: m._id,
// //           studentId: m.studentId._id,
// //           studentName: m.studentId.studentName,
// //           subjectId: m.subjectId,
// //           testscore: m.testscore,
// //           examscore: m.examscore,
// //           marksObtained: m.testscore + m.examscore,
// //           comment: m.comment,
// //         }));

// //       // Add to filteredMarks array
// //       filteredMarks = filteredMarks.concat(subjectMarks);
// //     }

// //     res.status(200).json({
// //       examId,
// //       subjectId,
// //       sessionId,
// //       marks: filteredMarks,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching scores:", error);
// //     res.status(500).json({ message: "Internal Server Error" });
// //   }
// // };
// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId, sessionId } = req.params;

//     // Validate ObjectIds
//     const isExamIdValid = mongoose.isValidObjectId(examId);
//     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
//     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

//     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
//       return res.status(400).json({
//         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
//       });
//     }

//     // Find all marks documents that match the examId, subjectId, and sessionId
//     const marks = await Mark.find({
//       examId: mongoose.Types.ObjectId(examId),
//       session: mongoose.Types.ObjectId(sessionId),
//       "marks.subjectId": mongoose.Types.ObjectId(subjectId),
//     });

//     if (!marks || marks.length === 0) {
//       return res.status(200).json({ examId, subjectId, sessionId, marks: [] });
//     }

//     // Flatten the marks array
//     let filteredMarks = [];

//     // Loop through each mark document
//     for (let mark of marks) {
//       // Filter and populate student names in the marks array
//       await Mark.populate(mark, {
//         path: "marks.studentId",
//         select: "studentName",
//       });

//       const subjectMarks = mark.marks
//         .filter((m) => m.subjectId.toString() === subjectId)
//         .map((m) => ({
//           _id: m._id,
//           studentId: m.studentId._id,
//           studentName: m.studentId.studentName,
//           subjectId: m.subjectId,
//           testscore: m.testscore,
//           examscore: m.examscore,
//           marksObtained: m.marksObtained, // Use the saved value of marksObtained
//           comment: m.comment,
//         }));

//       // Add to filteredMarks array
//       filteredMarks = filteredMarks.concat(subjectMarks);
//     }

//     res.status(200).json({
//       examId,
//       subjectId,
//       sessionId,
//       marks: filteredMarks,
//     });
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Delete all scores for a given exam, subject, and session
// export const deleteScores = async (req, res) => {
//   try {
//     const { examId, subjectId, sessionId } = req.params;

//     // Validate ObjectIds
//     const isExamIdValid = mongoose.isValidObjectId(examId);
//     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);
//     const isSessionIdValid = mongoose.isValidObjectId(sessionId);

//     if (!isExamIdValid || !isSubjectIdValid || !isSessionIdValid) {
//       return res.status(400).json({
//         message: "Invalid ObjectId format for examId, subjectId, or sessionId",
//       });
//     }

//     // Remove all scores for the specific exam, subject, and session
//     const result = await Mark.updateMany(
//       {
//         examId: mongoose.Types.ObjectId(examId),
//         session: mongoose.Types.ObjectId(sessionId),
//         "marks.subjectId": mongoose.Types.ObjectId(subjectId),
//       },
//       {
//         $pull: { marks: { subjectId: mongoose.Types.ObjectId(subjectId) } },
//       }
//     );

//     if (result.nModified === 0) {
//       return res
//         .status(404)
//         .json({ message: "No scores found for the given parameters" });
//     }

//     res.status(200).json({ message: "Scores deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting scores:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const updateMark = async (req, res) => {
//   try {
//     const { examId, subjectId, testscore, examscore, marksObtained, comment } =
//       req.body;
//     const studentIdToUpdate = req.params.studentId;

//     const result = await Mark.updateOne(
//       {
//         "marks.studentId": studentIdToUpdate,
//         examId,
//         "marks.subjectId": subjectId,
//       },
//       {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       },
//       {
//         arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
//       }
//     );

//     console.log("Update Result:", result);
//     console.log("Request Body:", req.body);

//     if (result.nModified === 0) {
//       return res
//         .status(404)
//         .json({ error: "No matching records found for update" });
//     }

//     const updatedDocument = await Mark.findOne({
//       "marks.studentId": studentIdToUpdate,
//       examId,
//       "marks.subjectId": subjectId,
//     });

//     res
//       .status(200)
//       .json({ message: "Marks updated successfully", updatedDocument });
//   } catch (error) {
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// export const addSessionToMarks = async (req, res) => {
//   try {
//     const { sessionId } = req.body; // Get sessionId from request body

//     if (!sessionId) {
//       return res.status(400).json({ message: "sessionId is required" });
//     }

//     // Find all Mark documents that do not have a session field
//     const marksToUpdate = await Mark.find({
//       session: { $exists: false },
//     });

//     if (marksToUpdate.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No marks found without session" });
//     }

//     // Loop through each Mark document and update it with the sessionId
//     for (const mark of marksToUpdate) {
//       mark.session = sessionId; // Set the sessionId at the root level
//       await mark.save(); // Save the updated mark document
//     }

//     res.status(200).json({
//       message: "SessionId added to all marks",
//       updated: marksToUpdate.length,
//     });
//   } catch (error) {
//     console.error("Error adding sessionId to marks:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // export const updateMarks = async (req, res) => {
// //   try {
// //     const { examId, subjectId, updates, sessionId } = req.body;
// //     console.log("Received in saveMark controller update:", req.body);

// //     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
// //       return res.status(400).json({ error: "Invalid request payload" });
// //     }

// //     const results = [];
// //     const updatedDocuments = [];

// //     for (const update of updates) {
// //       const { studentId, testscore, examscore, marksObtained, comment } =
// //         update;

// //       const filter = {
// //         examId,
// //         sessionId,
// //         "marks.studentId": studentId,
// //         "marks.subjectId": subjectId,
// //       };

// //       const updateOperation = {
// //         $set: {
// //           "marks.$[elem].testscore": testscore,
// //           "marks.$[elem].examscore": examscore,
// //           "marks.$[elem].marksObtained": marksObtained,
// //           "marks.$[elem].comment": comment,
// //         },
// //       };

// //       const options = {
// //         arrayFilters: [{ "elem.studentId": studentId }],
// //         new: true,
// //       };

// //       let updatedDoc = await Mark.findOneAndUpdate(
// //         filter,
// //         updateOperation,
// //         options
// //       );

// //       if (!updatedDoc) {
// //         // If the document doesn't exist, create a new mark
// //         const newMark = {
// //           subjectId,
// //           studentId,
// //           testscore,
// //           examscore,
// //           marksObtained,
// //           comment,
// //         };

// //         const filter = { examId };
// //         const update = { $push: { marks: newMark } };
// //         const options = { upsert: true, new: true };

// //         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
// //       }

// //       updatedDocuments.push(updatedDoc);

// //       results.push({
// //         studentId,
// //         success: true,
// //       });
// //     }

// //     res.status(200).json({
// //       message: "Marks updated successfully",
// //       results,
// //       updatedDocuments,
// //     });
// //   } catch (error) {
// //     console.error("Error updating marks:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // };

// // export const updateMarks = async (req, res) => {
// //   try {
// //     const { examId, subjectId, updates, sessionId } = req.body;
// //     console.log("Received in saveMark controller update:", req.body);

// //     // Validate input data
// //     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
// //       return res.status(400).json({ error: "Invalid request payload" });
// //     }

// //     const results = [];
// //     const updatedDocuments = [];

// //     for (const update of updates) {
// //       const { studentId, testscore, examscore, marksObtained, comment } =
// //         update;

// //       // Build the filter to find the correct exam and student marks
// //       const filter = {
// //         examId,
// //         sessionId,
// //         "marks.studentId": studentId,
// //         "marks.subjectId": subjectId, // Ensure the right subjectId is matched
// //       };

// //       // Define the update operation
// //       const updateOperation = {
// //         $set: {
// //           "marks.$[elem].testscore": testscore,
// //           "marks.$[elem].examscore": examscore,
// //           "marks.$[elem].marksObtained": marksObtained,
// //           "marks.$[elem].comment": comment,
// //         },
// //       };

// //       // Array filter to ensure only the correct student in the marks array is updated
// //       const options = {
// //         arrayFilters: [{ "elem.studentId": studentId }],
// //         new: true,
// //       };

// //       // Attempt to find and update the marks for the student
// //       let updatedDoc = await Mark.findOneAndUpdate(
// //         filter,
// //         updateOperation,
// //         options
// //       );

// //       if (!updatedDoc) {
// //         // If the document doesn't exist (i.e., no matching student marks), create a new mark
// //         const newMark = {
// //           subjectId,
// //           studentId,
// //           testscore,
// //           examscore,
// //           marksObtained,
// //           comment,
// //         };

// //         // If no document is found, push a new mark for the student into the marks array
// //         const filter = { examId, sessionId };
// //         const update = { $push: { marks: newMark } };
// //         const options = { upsert: true, new: true };

// //         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
// //       }

// //       // Track the updated document
// //       updatedDocuments.push(updatedDoc);

// //       // Track the update success for the student
// //       results.push({
// //         studentId,
// //         success: true,
// //       });
// //     }

// //     // Return response with updated documents and results
// //     res.status(200).json({
// //       message: "Marks updated successfully",
// //       results,
// //       updatedDocuments,
// //     });
// //   } catch (error) {
// //     // Catch and handle errors
// //     console.error("Error updating marks:", error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // };

// export const updateMarks = async (req, res) => {
//   try {
//     const { examId, subjectId, updates, sessionId } = req.body;
//     console.log("Received in updateMark controller:", req.body);

//     if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
//       return res.status(400).json({ error: "Invalid request payload" });
//     }

//     const results = [];
//     const updatedDocuments = [];

//     for (const update of updates) {
//       const { studentId, testscore, examscore, marksObtained, comment } =
//         update;

//       // Build the filter to find the correct exam and student marks
//       const filter = {
//         examId,
//         sessionId,
//         "marks.studentId": studentId,
//         "marks.subjectId": subjectId, // Ensure the right subjectId is matched
//       };

//       // Define the update operation
//       const updateOperation = {
//         $set: {
//           "marks.$[elem].testscore": testscore,
//           "marks.$[elem].examscore": examscore,
//           "marks.$[elem].marksObtained": marksObtained,
//           "marks.$[elem].comment": comment,
//         },
//       };

//       // Array filter to ensure only the correct student in the marks array is updated
//       const options = {
//         arrayFilters: [{ "elem.studentId": studentId }],
//         new: true,
//       };

//       // Attempt to find and update the marks for the student
//       let updatedDoc = await Mark.findOneAndUpdate(
//         filter,
//         updateOperation,
//         options
//       );

//       if (!updatedDoc) {
//         // If the document doesn't exist (i.e., no matching student marks), create a new mark
//         const newMark = {
//           subjectId,
//           studentId,
//           testscore,
//           examscore,
//           marksObtained,
//           comment,
//         };

//         // If no document is found, push a new mark for the student into the marks array
//         const filter = { examId, sessionId };
//         const update = { $push: { marks: newMark } };
//         const options = { upsert: true, new: true };

//         updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
//       }

//       // Track the updated document
//       updatedDocuments.push(updatedDoc);

//       // Track the update success for the student
//       results.push({
//         studentId,
//         success: true,
//       });
//     }

//     // Return response with updated documents and results
//     res.status(200).json({
//       message: "Marks updated successfully",
//       results,
//       updatedDocuments,
//     });
//   } catch (error) {
//     // Catch and handle errors
//     console.error("Error updating marks:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
import mongoose from "mongoose";
import Mark from "../models/markModel.js";
import Exam from "../models/examModel.js";
import Student from "../models/userModel.js";
import Class from "../models/classModel.js";
import Session from "../models/sessionModel.js";

export const saveMark = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const { examId, subjectId, updates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: "Invalid session ID" });
    }

    // Check if updates array is present in the request body
    if (!updates || !Array.isArray(updates)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing updates array" });
    }

    // Fetch existing marks for the specified exam and subject
    const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

    // If existing marks are not found or the array is empty, proceed to create new marks
    if (!existingMarks || existingMarks.marks.length === 0) {
      // Save marks to the database using the provided examId and subjectId
      const savedMarks = await Mark.create({
        examId,
        subjectId,
        session: sessionId,
        marks: await Promise.all(
          updates.map(async (mark) => {
            const { studentId, testscore, examscore, marksObtained, comment } =
              mark;

            return {
              studentId,
              subjectId: subjectId, // Add subjectId
              testscore,
              examscore,
              marksObtained,
              comment,
            };
          })
        ),
      });

      return res.status(201).json({
        message: "Marks saved successfully",
        savedMarks,
      });
    }

    // If existing marks are found, update the marks
    existingMarks.marks.forEach((existingMark) => {
      const update = updates.find(
        (mark) => mark.studentId === existingMark.studentId
      );

      if (update) {
        existingMark.testscore = update.testscore;
        existingMark.examscore = update.examscore;
        existingMark.marksObtained = update.marksObtained;
        existingMark.comment = update.comment;
      }
    });

    await existingMarks.save();

    res.status(200).json({
      message: "Marks updated successfully",
      updatedMarks: existingMarks,
    });
  } catch (error) {
    console.error("Error saving/updating marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMark = async (req, res) => {
  try {
    const { examName, sessionId } = req.params;

    // Fetch the exam based on the provided examName
    const fetchedExam = await Exam.findOne({ name: examName });

    const sessionObjectId = mongoose.Types.ObjectId(sessionId);

    if (!fetchedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Fetch the marks based on the ObjectId of the fetched exam
    const marks = await Mark.find({
      examId: fetchedExam._id,
      session: sessionObjectId,
    });

    if (marks.length === 0) {
      return res.status(404).json({ message: "Marks not found" });
    }

    // Ensure each mark has the subjectId populated
    const scores = marks.map((mark) => ({
      subjectId: mark.subjectId, // Make sure subjectId is set in your schema
      ...mark.toObject(),
    }));

    res.status(200).json({ examId: fetchedExam._id, scores });
  } catch (error) {
    console.error("Error fetching marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const userId = req.params.studentId; // Assuming the studentId is passed as a parameter in the URL

//     // Fetch marks for the specified student and populate the necessary fields
//     const marks = await Mark.find({ "marks.studentId": userId })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     // Ensure each mark has the examId and subjectId populated
//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter((m) => m.studentId.toString() === userId)
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     res.status(200).json({ studentId: userId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const userId = req.params.studentId;

//     const marks = await Mark.find({ "marks.studentId": userId })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     // const scores = marks.flatMap((mark) =>
//     //   mark.marks
//     //     .filter(
//     //       (m) =>
//     //         m.studentId.toString() === userId &&
//     //         (m.testscore !== 0 || m.examscore !== 0) &&
//     //         m.comment.trim() !== ""
//     //     )
//     //     .map((m) => ({
//     //       examId: mark.examId,
//     //       subjectId: m.subjectId,
//     //       examName: mark.examId.name,
//     //       subjectName: m.subjectId.name,
//     //       testscore: m.testscore,
//     //       ...m.toObject(),
//     //     }))
//     // );
//     // const scores = marks.flatMap((mark) =>
//     //   mark.marks
//     //     .filter(
//     //       (m) =>
//     //         m.studentId.toString() === userId &&
//     //         (m.testscore !== 0 || m.examscore !== 0) &&
//     //         m.comment.trim() !== ""
//     //     )
//     //     .map((m) => ({
//     //       examId: mark.examId,
//     //       subjectId: m.subjectId,
//     //       examName: mark.examId?.name || "Unknown Exam",
//     //       subjectName: m.subjectId?.name || "Unknown Subject",
//     //       testscore: m.testscore,
//     //       ...m.toObject(),
//     //     }))
//     // );
//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter(
//           (m) =>
//             m.studentId.toString() === userId &&
//             (m.testscore !== 0 || m.examscore !== 0) &&
//             m.comment.trim() !== "" &&
//             mark.examId &&
//             m.subjectId
//         )
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     res.status(200).json({ studentId: userId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     const sessionObjectId = mongoose.Types.ObjectId(sessionId);

//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionObjectId,
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

//     const scores = marks.flatMap(
//       (mark) =>
//         mark.marks
//           .filter(
//             (m) =>
//               m.studentId.toString() === studentId &&
//               (m.testscore !== 0 || m.examscore !== 0) &&
//               m.comment.trim() !== "" &&
//               mark.examId &&
//               m.subjectId
//           )
//           .map((m) => {
//             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
//             // Check if subject ID exists in the Map
//             if (!uniqueSubjects.has(subjectKey)) {
//               // If subject doesn't exist, add it to the Map and return the mapped object
//               uniqueSubjects.set(subjectKey, true);
//               return {
//                 examId: mark.examId,
//                 subjectId: m.subjectId,
//                 examName: mark.examId.name,
//                 subjectName: m.subjectId.name,
//                 testscore: m.testscore,
//                 ...m.toObject(),
//               };
//             }
//             return null; // If subject exists, return null (to filter it out)
//           })
//           .filter((m) => m !== null) // Filter out null values
//     );

//     res.status(200).json({ studentId: studentId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     // Fetch marks where the session matches
//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId,
//     })
//       .populate("examId", "name") // Populate exam details
//       .populate("marks.subjectId", "name"); // Populate subject details

//     if (!marks || marks.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No marks found for the student." });
//     }

//     // Filter and map marks to include only data for the specified student
//     const scores = marks.map((mark) => ({
//       examId: mark.examId?._id,
//       examName: mark.examId?.name,
//       subjects: mark.marks
//         .filter((m) => m.studentId.toString() === studentId) // Filter for this student only
//         .map((m) => ({
//           testScore: m.testscore,
//           examScore: m.examscore,
//           comment: m.comment,
//           subjectId: m.subjectId?._id,
//           subjectName: m.subjectId?.name,
//         })),
//     }));

//     res.status(200).json({ studentId, sessionId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     // Querying with "session" field instead of "sessionId"
//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId, // Corrected to match the field in your database
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     console.log("Marks found:", marks); // Log what is being returned

//     const uniqueSubjects = new Map(); // Use a Map to store unique subjects

//     const scores = marks.flatMap(
//       (mark) =>
//         mark.marks
//           .filter(
//             (m) =>
//               m.studentId.toString() === studentId &&
//               (m.testscore !== 0 || m.examscore !== 0) &&
//               m.comment.trim() !== "" &&
//               mark.examId &&
//               m.subjectId
//           )
//           .map((m) => {
//             const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
//             // Check if subject ID exists in the Map
//             if (!uniqueSubjects.has(subjectKey)) {
//               // If subject doesn't exist, add it to the Map and return the mapped object
//               uniqueSubjects.set(subjectKey, true);
//               return {
//                 examId: mark.examId,
//                 subjectId: m.subjectId,
//                 examName: mark.examId.name,
//                 subjectName: m.subjectId.name,
//                 testscore: m.testscore,
//                 ...m.toObject(),
//               };
//             }
//             return null; // If subject exists, return null (to filter it out)
//           })
//           .filter((m) => m !== null) // Filter out null values
//     );

//     res.status(200).json({ studentId, sessionId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const getMarkbyStudent = async (req, res) => {
//   try {
//     const { studentId, sessionId } = req.params;

//     const marks = await Mark.find({
//       "marks.studentId": studentId,
//       session: sessionId,
//     })
//       .populate("examId", "name")
//       .populate("marks.subjectId", "name");

//     const scores = marks.flatMap((mark) =>
//       mark.marks
//         .filter(
//           (m) =>
//             m.studentId.toString() === studentId &&
//             (m.testscore !== 0 || m.examscore !== 0) &&
//             m.comment.trim() !== "" &&
//             mark.examId &&
//             m.subjectId
//         )
//         .map((m) => ({
//           examId: mark.examId,
//           subjectId: m.subjectId,
//           examName: mark.examId.name,
//           subjectName: m.subjectId.name,
//           testscore: m.testscore,
//           ...m.toObject(),
//         }))
//     );

//     res.status(200).json({ studentId, sessionId, scores });
//   } catch (error) {
//     console.error("Error fetching marks for student:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const getMarkbyStudent = async (req, res) => {
  try {
    const { studentId, sessionId } = req.params;

    const marks = await Mark.find({
      "marks.studentId": studentId,
      session: sessionId,
    })
      .populate("examId", "name")
      .populate("marks.subjectId", "name");

    // Flatten the marks and filter valid scores
    const scores = marks.flatMap((mark) =>
      mark.marks
        .filter(
          (m) =>
            m.studentId.toString() === studentId &&
            (m.testscore !== 0 || m.examscore !== 0) &&
            m.comment.trim() !== "" &&
            mark.examId &&
            m.subjectId
        )
        .map((m) => ({
          examId: mark.examId,
          subjectId: m.subjectId,
          examName: mark.examId.name,
          subjectName: m.subjectId.name,
          testscore: m.testscore,
          ...m.toObject(),
        }))
    );

    // Deduplicate based on examId and subjectId using reduce
    const uniqueScores = scores.reduce((acc, current) => {
      // Check if an entry with the same examId and subjectId already exists
      const isDuplicate = acc.some(
        (item) =>
          item.examId._id.toString() === current.examId._id.toString() &&
          item.subjectId._id.toString() === current.subjectId._id.toString()
      );

      if (!isDuplicate) {
        acc.push(current); // Add unique entry
      }
      return acc;
    }, []);

    res.status(200).json({ studentId, sessionId, scores: uniqueScores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMarkbyStudentwithoutsession = async (req, res) => {
  try {
    const userId = req.params.studentId;

    const marks = await Mark.find({ "marks.studentId": userId })
      .populate("examId", "name")
      .populate("marks.subjectId", "name");

    const uniqueSubjects = new Map(); // Use a Map to store unique subjects

    const scores = marks.flatMap(
      (mark) =>
        mark.marks
          .filter(
            (m) =>
              m.studentId.toString() === userId &&
              (m.testscore !== 0 || m.examscore !== 0) &&
              m.comment.trim() !== "" &&
              mark.examId &&
              m.subjectId
          )
          .map((m) => {
            const subjectKey = m.subjectId._id.toString(); // Use subject ID as key
            // Check if subject ID exists in the Map
            if (!uniqueSubjects.has(subjectKey)) {
              // If subject doesn't exist, add it to the Map and return the mapped object
              uniqueSubjects.set(subjectKey, true);
              return {
                examId: mark.examId,
                subjectId: m.subjectId,
                examName: mark.examId.name,
                subjectName: m.subjectId.name,
                testscore: m.testscore,
                ...m.toObject(),
              };
            }
            return null; // If subject exists, return null (to filter it out)
          })
          .filter((m) => m !== null) // Filter out null values
    );

    res.status(200).json({ studentId: userId, scores });
  } catch (error) {
    console.error("Error fetching marks for student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId } = req.params;

//     const isExamIdValid = mongoose.isValidObjectId(examId);
//     const isSubjectIdValid = mongoose.isValidObjectId(subjectId);

//     if (!isExamIdValid && !isSubjectIdValid) {
//       return res.status(400).json({
//         message: "Invalid ObjectId format for both examId and subjectId",
//       });
//     }

//     const marks = await Mark.findOne({
//       examId: isExamIdValid ? mongoose.Types.ObjectId(examId) : null,
//       "marks.subjectId": isSubjectIdValid
//         ? mongoose.Types.ObjectId(subjectId)
//         : null,
//     });

//     if (!marks) {
//       return res.status(200).json({ examId, subjectId, scores: [] });
//     }

//     // Populate the studentId field to get the student details
//     await Mark.populate(marks, {
//       path: "marks.studentId",
//       select: "studentName",
//     });

//     // Extract relevant information for response
//     const scores = marks.marks.map((m) => ({
//       studentId: m.studentId,
//       studentName: m.studentId ? m.studentId.studentName : null,
//       testscore: m.testscore,
//       examscore: m.examscore,
//       marksObtained: m.testscore + m.examscore,
//       comment: m.comment,
//     }));

//     res.status(200).json({ examId, subjectId, scores });
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const getScores = async (req, res) => {
//   try {
//     const { examId, subjectId, classId, sessionId } = req.params;

//     if (
//       !mongoose.isValidObjectId(examId) ||
//       !mongoose.isValidObjectId(subjectId) ||
//       !mongoose.isValidObjectId(classId) ||
//       !mongoose.isValidObjectId(sessionId)
//     ) {
//       return res.status(400).json({ message: "Invalid parameters" });
//     }

//     const markDoc = await Mark.findOne({
//       examId,
//       classId,
//       session: sessionId,
//     }).populate({
//       path: "marks.studentId",
//       select: "studentName AdmNo",
//     });

//     if (!markDoc) {
//       return res.status(200).json({
//         examId,
//         subjectId,
//         classId,
//         scores: [],
//       });
//     }

//     // 🎯 Filter marks for this subject only
//     const scores = markDoc.marks
//       .filter(
//         (m) => m.subjectId.toString() === subjectId.toString()
//       )
//       .map((m) => ({
//         studentId: m.studentId?._id,
//         studentName: m.studentId?.studentName || null,
//         admNo: m.studentId?.AdmNo || null,
//         testscore: m.testscore ?? 0,
//         examscore: m.examscore ?? 0,
//         marksObtained: (m.testscore ?? 0) + (m.examscore ?? 0),
//         comment: m.comment || "",
//       }));

//     return res.status(200).json({
//       examId,
//       subjectId,
//       classId,
//       scores,
//     });
//   } catch (error) {
//     console.error("Error fetching scores:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const getScores = async (req, res) => {
  try {
    const { examId, subjectId, sessionId } = req.params;

    const markDoc = await Mark.findOne({
      examId,
      session: sessionId,
      "marks.subjectId": subjectId,   // 🔥 THIS IS THE FIX
    })
      .populate("marks.studentId", "studentName AdmNo")
      .lean();

    if (!markDoc) {
      return res.status(404).json({ message: "No marks for this subject" });
    }

    const scores = markDoc.marks
      .filter(m => String(m.subjectId) === subjectId)
      .map(m => ({
        studentId: m.studentId?._id || m.studentId,
        studentName: m.studentId?.studentName || "",
        admNo: m.studentId?.AdmNo || "",
        testscore: m.testscore ?? 0,
        examscore: m.examscore ?? 0,
        marksObtained: m.marksObtained ?? 0,
        comment: m.comment ?? ""
      }));

    return res.json({
      examId,
      subjectId,
      total: scores.length,
      scores
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};






export const updateMark = async (req, res) => {
  try {
    const { examId, subjectId, testscore, examscore, marksObtained, comment } =
      req.body;
    const studentIdToUpdate = req.params.studentId;

    const result = await Mark.updateOne(
      {
        "marks.studentId": studentIdToUpdate,
        examId,
        "marks.subjectId": subjectId,
      },
      {
        $set: {
          "marks.$[elem].testscore": testscore,
          "marks.$[elem].examscore": examscore,
          "marks.$[elem].marksObtained": marksObtained,
          "marks.$[elem].comment": comment,
        },
      },
      {
        arrayFilters: [{ "elem.studentId": studentIdToUpdate }],
      }
    );

    console.log("Update Result:", result);
    console.log("Request Body:", req.body);

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ error: "No matching records found for update" });
    }

    const updatedDocument = await Mark.findOne({
      "marks.studentId": studentIdToUpdate,
      examId,
      "marks.subjectId": subjectId,
    });

    res
      .status(200)
      .json({ message: "Marks updated successfully", updatedDocument });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const addSessionToMarks = async (req, res) => {
  try {
    const { sessionId } = req.body; // Get sessionId from request body

    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    // Find all Mark documents that do not have a session field
    const marksToUpdate = await Mark.find({
      session: { $exists: false },
    });

    if (marksToUpdate.length === 0) {
      return res
        .status(404)
        .json({ message: "No marks found without session" });
    }

    // Loop through each Mark document and update it with the sessionId
    for (const mark of marksToUpdate) {
      mark.session = sessionId; // Set the sessionId at the root level
      await mark.save(); // Save the updated mark document
    }

    res.status(200).json({
      message: "SessionId added to all marks",
      updated: marksToUpdate.length,
    });
  } catch (error) {
    console.error("Error adding sessionId to marks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateMarks = async (req, res) => {
  try {
    const { examId, subjectId, updates } = req.body;

    if (!examId || !subjectId || !updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: "Invalid request payload" });
    }

    const results = [];
    const updatedDocuments = [];

    for (const update of updates) {
      const { studentId, testscore, examscore, marksObtained, comment } =
        update;

      const filter = {
        examId,
        "marks.studentId": studentId,
        "marks.subjectId": subjectId,
      };

      const updateOperation = {
        $set: {
          "marks.$[elem].testscore": testscore,
          "marks.$[elem].examscore": examscore,
          "marks.$[elem].marksObtained": marksObtained,
          "marks.$[elem].comment": comment,
        },
      };

      const options = {
        arrayFilters: [{ "elem.studentId": studentId }],
        new: true,
      };

      let updatedDoc = await Mark.findOneAndUpdate(
        filter,
        updateOperation,
        options
      );

      if (!updatedDoc) {
        // If the document doesn't exist, create a new mark
        const newMark = {
          subjectId,
          studentId,
          testscore,
          examscore,
          marksObtained,
          comment,
        };

        const filter = { examId };
        const update = { $push: { marks: newMark } };
        const options = { upsert: true, new: true };

        updatedDoc = await Mark.findOneAndUpdate(filter, update, options);
      }

      updatedDocuments.push(updatedDoc);

      results.push({
        studentId,
        success: true,
      });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      results,
      updatedDocuments,
    });
  } catch (error) {
    console.error("Error updating marks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
