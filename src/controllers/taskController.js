//taskController.js
const Task = require("../models/taskModel");

/**
 * Apis to handle all the task functionalities
 *
 * @class TaskController
 * @typedef {TaskController}
 */
class TaskController {
  /**
   * Creates a new task.
   * This method handles the creation of a new task in the database.
   * It expects the task details to be provided in the request body.
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>} - Returns a JSON response
   */
  async createTask(req, res) {
    try {
      const task = await Task.create({
        ...req.body,
        UserId: req.user.id,
      });
      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      res
        .status(400)
        .json({ error: "Failed to create task: " + error.message });
    }
  }
  /**
   * Retrieves all tasks with optional filtering and sorting.
   * This method fetches all tasks from the database. It can filter tasks by status
   * and sort them based on a specified field.
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>} - Returns a JSON response
   */
  async getAllTasks(req, res) {
    try {
      const { status, sort, page = 1, limit = 10 } = req.query;
      const where = {};

      if (status) {
        where.status = status;
      }

      const order = sort ? [[sort, "ASC"]] : [["createdAt", "DESC"]];
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const offset = (pageNumber - 1) * pageSize;

      const { count, rows: tasks } = await Task.findAndCountAll({
        where,
        order,
        limit: pageSize,
        offset,
      });

      const totalPages = Math.ceil(count / pageSize);

      res.json({
        message: "Tasks retrieved successfully",
        totalItems: count,
        totalPages,
        currentPage: pageNumber,
        pageSize: pageSize,
        tasks,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to retrieve tasks: " + error.message });
    }
  }
  /**
   * Updates an existing task by ID.
   * This method updates the details of a task specified by its ID.
   * It expects the updated task details to be provided in the request body.
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>} - Returns a JSON response
   */
  async updateTask(req, res) {
    try {
      const [updated] = await Task.update(req.body, {
        where: { id: req.params.id },
      });
      if (updated) {
        const updatedTask = await Task.findByPk(req.params.id);
        res.json({ message: "Task updated successfully", updatedTask });
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Failed to update task: " + error.message });
    }
  }

  /**
   * Deletes a task by ID.
   * This method deletes a task specified by its ID from the database.
   *
   * @async
   * @param {Object} req
   * @param {Object} res
   * @returns {Promise<void>} - Returns a 204 status code on successful deletion or an error message with a 404 status code if the task is not found.
   */
  async deleteTask(req, res) {
    try {
      const deleted = await Task.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        res.status(204).send({ message: "Task deleted successfully" });
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Failed to delete task: " + error.message });
    }
  }
}

module.exports = new TaskController();
