// backend/controllers/adminController.js
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/DoctorModel.js";
import jwt from "jsonwebtoken";

// Controller for adding a new doctor
export const addDoctor = async (req, res) => {
  try {
    // DEBUG: log incoming file and headers
    console.log("<<< CONTENT-TYPE:", req.headers["content-type"]);
    console.log("<<< REQ.FILE:", req.file);

    // 1. Ensure Multer ran and gave you a file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image under the field name 'image'",
      });
    }

    const imageFile = req.file;
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fee,
      address,
    } = req.body;

    // 2. Validate other fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fee ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    // 5. Parse address JSON safely
    let parsedAddress;
    try {
      parsedAddress =
        typeof address === "string" ? JSON.parse(address) : address;
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Address must be valid JSON",
      });
    }

    // 6. Build and save doctor record
    const newDoctor = new doctorModel({
      name,
      email,
      password: hashedPassword,
      image: uploadResult.secure_url,
      speciality,
      degree,
      experience,
      about,
      fee,
      address: parsedAddress,
      date: Date.now(),
    });
    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor added successfully",
      data: newDoctor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Controller for admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check credentials against env vars
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ success: true, message: "Login successful", token });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
