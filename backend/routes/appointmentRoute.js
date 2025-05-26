import express from "express";
import { createAppointment } from "../controllers/appointmentController.js";
const router = express.Router();

// POST /api/appointments/book
router.post("/book", createAppointment);

export default router;
