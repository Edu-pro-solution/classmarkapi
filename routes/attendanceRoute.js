import express from "express";
import { checkIn, markBulkAttendance, getAttendanceByDate, getRecentCheckIns } from "../controller/attendanceController.js";
import authenticateUser from "../middleware/authMiddleware.js";


const router = express.Router();
router.post("/attendance/check-in", authenticateUser, checkIn);
router.post("/attendance", authenticateUser, markBulkAttendance);
router.get("/attendance/:sessionId/:className/:date", authenticateUser, getAttendanceByDate);
router.get("/attendance/recent/:sessionId", authenticateUser, getRecentCheckIns);

export default router;
