import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Patient from "../models/patientModel.js";
import { sendEmail } from "../utils/mailer.js";
import { createInAppMessage } from "../utils/messages.js";
import { scheduleReminders } from "../utils/scheduler.js";

export const createAppointment = async (req, res) => {
  const { patientId, doctorId, date, time, fees } = req.body;
  const appt = await Appointment.create({
    patientId,
    doctorId,
    date,
    time,
    fees,
  });

  // Immediate notifications
  await createInAppMessage({
    to: doctorId,
    from: patientId,
    subject: "New Appointment",
    body: `You have a new appointment on ${date} at ${time}.`,
  });
  const doctor = await Doctor.findById(doctorId);
  await sendEmail({
    to: doctor.email,
    subject: "📅 New Appointment Booked",
    text: `Hello Dr. ${doctor.name}, you have a new appointment on ${date} at ${time}.`,
  });

  // Schedule reminders
  scheduleReminders(appt);

  res.status(201).json({ success: true, data: appt });
};
