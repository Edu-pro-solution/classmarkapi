import Homework from "../models/Homework.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from "openai";

// Only initializes if OPENAI_API_KEY is set, so the server doesn't crash
// if you haven't configured it yet.
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Helper to consistently pull the logged-in user's id off req.user,
// regardless of whether your JWT payload uses "id" or "_id".
const getUserId = (req) => req.user?.id || req.user?._id;

// GET /api/homework/submissions?sessionId=...
export const getHomeworkSubmissions = async (req, res) => {
  try {
    const studentId = getUserId(req);
    if (!studentId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const { sessionId } = req.query;
    const filter = { student: studentId };
    if (sessionId) filter.session = sessionId;

    const submissions = await Homework.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error("getHomeworkSubmissions error:", error);
    res.status(500).json({ message: "Failed to load homework submissions." });
  }
};

// POST /api/homework/submissions (multipart/form-data)
// Returned as a factory so the shared S3 client from index.js can be injected in.
export const createHomeworkSubmission = (s3) => async (req, res) => {
  try {
    const studentId = getUserId(req);
    if (!studentId) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const { title, subject, prompt, answerText, attachmentName, session } = req.body;

    if (!title || !answerText) {
      return res.status(400).json({ message: "Homework title and answer are required." });
    }
    if (!session) {
      return res.status(400).json({ message: "Session is required." });
    }

    let attachmentUrl = "";
    let finalAttachmentName = attachmentName || "";

    // req.file is populated by multer (see homeworkRoute.js) when a file was attached
    if (req.file) {
      if (!process.env.AWS_BUCKET_NAME) {
        throw new Error("AWS_BUCKET_NAME is not set");
      }

      const key = `homework/${studentId}/${Date.now()}-${req.file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      // Adjust this if your bucket isn't publicly readable — you'd generate
      // a signed URL on read instead of storing a plain public URL here.
      attachmentUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      finalAttachmentName = req.file.originalname;
    }

    const submission = await Homework.create({
      title,
      subject,
      prompt,
      answerText,
      attachmentName: finalAttachmentName,
      attachmentUrl,
      student: studentId,
      session,
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("createHomeworkSubmission error:", error);
    res.status(500).json({ message: "Failed to submit homework." });
  }
};

// POST /api/homework/assistant
export const askHomeworkAssistant = async (req, res) => {
  try {
    const { question, subject } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required." });
    }

    if (!openai) {
      return res.status(500).json({
        message: "AI assistant is not configured. Set OPENAI_API_KEY on the server.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful homework assistant for school students. Explain concepts clearly and guide the student's thinking rather than just handing over finished answers for graded work.",
        },
        {
          role: "user",
          content: subject ? `Subject: ${subject}\nQuestion: ${question}` : question,
        },
      ],
      temperature: 0.4,
    });

    const answer = completion.choices?.[0]?.message?.content || "";
    res.json({ answer });
  } catch (error) {
    console.error("askHomeworkAssistant error:", error);
    res.status(500).json({ message: "Homework assistant failed." });
  }
};
