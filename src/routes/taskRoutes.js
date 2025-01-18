const express = require("express");
const TaskController = require("../controllers/taskController");
const router = express.Router();

router.post("/", TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
