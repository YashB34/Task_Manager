const express = require("express");
const router = express.Router();

const { getTasks } = require("../controllers/taskController");
const { updateTaskStatus } = require("../controllers/taskController");
const { createTask } = require("../controllers/taskController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const { deleteTask } = require("../controllers/taskController");



router.post("/", verifyToken, isAdmin, createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, updateTaskStatus);
router.delete("/:id", verifyToken, isAdmin, deleteTask);
module.exports = router;
