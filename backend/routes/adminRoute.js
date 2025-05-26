import express from "express";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { addDoctor, loginAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

// DEBUG: echo route for testing multipart/form-data
adminRouter.post("/echo", upload.single("image"), (req, res) => {
  return res.json({
    contentType: req.headers["content-type"],
    file: req.file,
    body: req.body,
  });
});

// Protected: Add a new doctor (expects 'image' file + form fields)
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);

// Admin login (JSON body)
adminRouter.post("/login", loginAdmin);

export default adminRouter;
