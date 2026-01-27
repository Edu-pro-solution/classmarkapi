
import mongoose from "mongoose";
import Mark from "../models/markModel.js";
import Exam from "../models/examModel.js";
import Student from "../models/userModel.js";
import Class from "../models/classModel.js";
import Session from "../models/sessionModel.js";
import Subject from "../models/subModel.js";
// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
//       return res.status(400).json({ error: "Invalid session ID" });
//     }

//     // Check if updates array is present in the request body
//     if (!updates || !Array.isArray(updates)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or missing updates array" });
//     }

//     // Fetch existing marks for the specified exam and subject
//     const existingMarks = await Mark.findOne({ examId, subjectId, sessionId });

//     // If existing marks are not found or the array is empty, proceed to create new marks
//     if (!existingMarks || existingMarks.marks.length === 0) {
//       // Save marks to the database using the provided examId and subjectId
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
//               subjectId: subjectId, // Add subjectId
//               testscore,
//               examscore,
//               marksObtained,
//               comment,
//             };
//           })
//         ),
//       });

//       return res.status(201).json({
//         message: "Marks saved successfully",
//         savedMarks,
//       });
//     }

//     // If existing marks are found, update the marks
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
// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (
//       !mongoose.Types.ObjectId.isValid(sessionId) ||
//       !mongoose.Types.ObjectId.isValid(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

//     let markDoc = await Mark.findOne({
//       examId,
//       session: sessionId,
//     });

//     // 🆕 FIRST SAVE
//     if (!markDoc) {
//       markDoc = new Mark({
//         examId,
//         session: sessionId,
//         marks: updates.map(u => ({
//           studentId: u.studentId,
//           subjectId: subjectObjectId, // ✅ FIXED
//           testscore: u.testscore ?? 0,
//           examscore: u.examscore ?? 0,
//           marksObtained: (u.testscore ?? 0) + (u.examscore ?? 0),
//           comment: u.comment ?? "",
//         })),
//       });

//       await markDoc.save();
//       return res.status(201).json({ message: "Saved", markDoc });
//     }

//     // 🔁 UPDATE / INSERT
//     updates.forEach(update => {
//       const existing = markDoc.marks.find(
//         m =>
//           m.studentId.toString() === update.studentId.toString() &&
//           m.subjectId.toString() === subjectObjectId.toString()
//       );

//       if (existing) {
//         existing.testscore = update.testscore ?? existing.testscore;
//         existing.examscore = update.examscore ?? existing.examscore;
//         existing.marksObtained =
//           (existing.testscore ?? 0) + (existing.examscore ?? 0);
//         existing.comment = update.comment ?? existing.comment;
//       } else {
//         markDoc.marks.push({
//           studentId: update.studentId,
//           subjectId: subjectObjectId, // ✅ FIXED
//           testscore: update.testscore ?? 0,
//           examscore: update.examscore ?? 0,
//           marksObtained:
//             (update.testscore ?? 0) + (update.examscore ?? 0),
//           comment: update.comment ?? "",
//         });
//       }
//     });

//     await markDoc.save();

//     res.json({ message: "Updated", markDoc });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// export const saveMark = async (req, res) => {
//   const { sessionId } = req.params;

//   try {
//     const { examId, subjectId, updates } = req.body;

//     if (
//       !mongoose.Types.ObjectId.isValid(sessionId) ||
//       !mongoose.Types.ObjectId.isValid(subjectId)
//     ) {
//       return res.status(400).json({ message: "Invalid ID" });
//     }

//     const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

//     let markDoc = await Mark.findOne({ examId, session: sessionId });

//     // FIRST SAVE
//     if (!markDoc) {
//       markDoc = new Mark({
//         examId,
//         session: sessionId,
//         marks: updates.map(u => ({
//           studentId: mongoose.Types.ObjectId(u.studentId),
//           subjectId: subjectObjectId,
//           testscore: u.testscore ?? 0,
//           examscore: u.examscore ?? 0,
//           marksObtained: (u.testscore ?? 0) + (u.examscore ?? 0),
//           comment: u.comment ?? "",
//         })),
//       });
//       await markDoc.save();
//       return res.status(201).json({ message: "Saved", markDoc });
//     }

//     // UPDATE / INSERT
//     for (const update of updates) {
//       const studentObjectId = mongoose.Types.ObjectId(update.studentId);

//       const existing = markDoc.marks.find(
//         m =>
//           m.studentId.toString() === studentObjectId.toString() &&
//           m.subjectId.toString() === subjectObjectId.toString()
//       );

//       if (existing) {
//         existing.testscore = update.testscore ?? 0;
//         existing.examscore = update.examscore ?? 0;
//         existing.marksObtained = existing.testscore + existing.examscore;
//         existing.comment = update.comment ?? existing.comment;
//       } else {
//         markDoc.marks.push({
//           studentId: studentObjectId,
//           subjectId: subjectObjectId,
//           testscore: update.testscore ?? 0,
//           examscore: update.examscore ?? 0,
//           marksObtained: (update.testscore ?? 0) + (update.examscore ?? 0),
//           comment: update.comment ?? "",
//         });
//       }
//     }

//     await markDoc.save();

//     res.json({ message: "Updated", markDoc });
//   } catch (err) {
//     console.error("❌ Error saving marks:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const saveMark = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const { examId, subjectId, updates } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(sessionId) ||
      !mongoose.Types.ObjectId.isValid(subjectId)
    ) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    // Fetch existing mark document
    let markDoc = await Mark.findOne({ examId, session: sessionId });

    // If no document exists, create a new one
    if (!markDoc) {
      markDoc = new Mark({
        examId,
        session: sessionId,
        marks: updates.map(u => ({
          studentId: mongoose.Types.ObjectId(u.studentId),
          subjectId: subjectObjectId,
          testscore: u.testscore !== undefined ? u.testscore : 0,
          examscore: u.examscore !== undefined ? u.examscore : 0,
          marksObtained:
            (u.testscore !== undefined ? u.testscore : 0) +
            (u.examscore !== undefined ? u.examscore : 0),
          comment: u.comment || "",
        })),
      });
      await markDoc.save();
      return res.status(201).json({ message: "Saved", markDoc });
    }

    // Update existing marks or insert new ones
    for (const update of updates) {
      const studentObjectId = mongoose.Types.ObjectId(update.studentId);

      const existing = markDoc.marks.find(
        m =>
          m.studentId.toString() === studentObjectId.toString() &&
          m.subjectId.toString() === subjectObjectId.toString()
      );

      if (existing) {
        // Only update fields if values are provided
        if (update.testscore !== undefined) existing.testscore = update.testscore;
        if (update.examscore !== undefined) existing.examscore = update.examscore;
        if (update.comment !== undefined) existing.comment = update.comment;

        // Recalculate total safely
        existing.marksObtained =
          (existing.testscore || 0) + (existing.examscore || 0);
      } else {
        // Insert new mark only with values or default 0 if new
        markDoc.marks.push({
          studentId: studentObjectId,
          subjectId: subjectObjectId,
          testscore: update.testscore !== undefined ? update.testscore : 0,
          examscore: update.examscore !== undefined ? update.examscore : 0,
          marksObtained:
            (update.testscore !== undefined ? update.testscore : 0) +
            (update.examscore !== undefined ? update.examscore : 0),
          comment: update.comment || "",
        });
      }
    }

    await markDoc.save();

    res.json({ message: "Updated", markDoc });
  } catch (err) {
    console.error("❌ Error saving marks:", err);
    res.status(500).json({ message: "Server error" });
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
            m.comment?.trim() &&
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
             m.comment?.trim() &&
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
//     const { examId, subjectId, sessionId } = req.params;

//     const markDoc = await Mark.findOne({
//       examId,
//       session: sessionId,
//       "marks.subjectId": subjectId,   // 🔥 THIS IS THE FIX
//     })
//       .populate("marks.studentId", "studentName AdmNo")
//       .lean();

//     if (!markDoc) {
//       return res.status(404).json({ message: "No marks for this subject" });
//     }

//     const scores = markDoc.marks
//       .filter(m => String(m.subjectId) === subjectId)
//       .map(m => ({
//         studentId: m.studentId?._id || m.studentId,
//         studentName: m.studentId?.studentName || "",
//         admNo: m.studentId?.AdmNo || "",
//         testscore: m.testscore ?? 0,
//         examscore: m.examscore ?? 0,
//         marksObtained: m.marksObtained ?? 0,
//         comment: m.comment ?? ""
//       }));

//     return res.json({
//       examId,
//       subjectId,
//       total: scores.length,
//       scores
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const getScores = async (req, res) => {
  try {
    const { examId, subjectId, sessionId } = req.params;

    const subjectObjectId = new mongoose.Types.ObjectId(subjectId);

    // ✅ 1. Fetch ALL Mark documents for this exam + session
    const markDocs = await Mark.find({
      examId,
      session: sessionId,
    })
      .populate("marks.studentId", "studentName AdmNo")
      .lean();

    if (!markDocs.length) {
      return res.json({ scores: [] });
    }

    // ✅ 2. Merge ALL marks from ALL documents
    const allMarks = markDocs.flatMap(doc => doc.marks);

    // ✅ 3. Filter by subject
    const scores = allMarks.filter(
      m => m.subjectId.toString() === subjectObjectId.toString()
    );

    console.log("🎯 Marks after subject filter:", scores.length);

    res.json({ scores });
  } catch (err) {
    console.error("❌ Error fetching scores:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const getAllScoresForExamSession = async (req, res) => {
  try {
    const { examId, sessionId, classname } = req.params;

    // 1️⃣ Get all students in this class AND session
    let students = await Student.find({ 
      classname: classname.trim(),
      session: sessionId 
    }).lean();

    if (!students.length) {
      return res.status(404).json({ message: "No students found in this class for the given session" });
    }

    // Remove duplicate students just in case
    const uniqueStudents = Array.from(
      new Map(students.map(s => [s._id.toString(), s])).values()
    );

    // 2️⃣ Get all subjects for this class AND session
    const subjects = await Subject.find({ classname: classname.trim(), session: sessionId }).lean();
    if (!subjects.length) {
      return res.status(404).json({ message: "No subjects found for this class/session" });
    }

    // 3️⃣ Get all marks for this exam and session
    const markDocs = await Mark.find({ examId, session: sessionId })
      .populate("marks.studentId", "studentName AdmNo")
      .lean();

    // 4️⃣ Prepare results per subject
    const results = subjects.map(subject => {
      const subjectScores = uniqueStudents.map(student => {
        // Search all markDocs for this student & subject
        let mark = null;
        for (const doc of markDocs) {
          mark = doc.marks.find(
            m =>
              (m.studentId?._id?.toString() || m.studentId?.toString()) === student._id.toString() &&
              m.subjectId.toString() === subject._id.toString()
          );
          if (mark) break;
        }

        return {
          studentId: student._id,
          studentName: student.studentName,
          admNo: student.AdmNo,
          testscore: mark?.testscore ?? 0,
          examscore: mark?.examscore ?? 0,
          marksObtained: mark ? mark.testscore + mark.examscore : 0,
          comment: mark?.comment ?? ""
        };
      });

      return {
        subjectId: subject._id,
        subjectName: subject.name,
        totalStudents: uniqueStudents.length,
        scores: subjectScores
      };
    });

    // 5️⃣ Return final response
    return res.json({
      examId,
      sessionId,
      classname,
      totalSubjects: subjects.length,
      totalStudents: uniqueStudents.length,
      results
    });

  } catch (err) {
    console.error("Error fetching all scores:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fixSubjectIds = async (req, res) => {
  try {
    const { sessionId, examId } = req.params;

    const markDoc = await Mark.findOne({ examId, session: sessionId });

    if (!markDoc) {
      return res.status(404).json({ message: "No marks found" });
    }

    let fixedSubjectCount = 0;
    let fixedScoreCount = 0;

    markDoc.marks.forEach(mark => {
      // Fix subjectId if it is a string
      if (typeof mark.subjectId === "string") {
        mark.subjectId = mongoose.Types.ObjectId(mark.subjectId);
        fixedSubjectCount++;
      }

      // Fix null or undefined scores
      if (mark.testscore == null) {
        mark.testscore = 0;
        fixedScoreCount++;
      }
      if (mark.examscore == null) {
        mark.examscore = 0;
        fixedScoreCount++;
      }
      if (mark.marksObtained == null) {
        mark.marksObtained = mark.testscore + mark.examscore;
      }
    });

    await markDoc.save();

    return res.json({
      message: `Fixed ${fixedSubjectCount} subjectIds and ${fixedScoreCount} missing scores`,
      markDoc
    });
  } catch (err) {
    console.error("❌ Error fixing subjectIds and scores:", err);
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
  