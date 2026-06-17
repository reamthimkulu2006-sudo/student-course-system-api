const express = require("express");
const router = express.Router();

// Middleware
const authMiddleware = require("../middlewares/authMiddleware");

// Controllers
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

// Routes (Protected)
router.get("/", authMiddleware, getStudents);
router.get("/:id", authMiddleware, getStudent);
router.post("/", authMiddleware, createStudent);
router.put("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);

module.exports = router;