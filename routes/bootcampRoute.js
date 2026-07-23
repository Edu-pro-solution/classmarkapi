import express from "express";

import { createBootcamp } from "../controller/bootcampController.js";

const router = express.Router();

router.post("/bootcamp", createBootcamp);

export default router;