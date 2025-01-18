const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { Op } = require("sequelize");

/**
 * @class AuthController
 * @description Controller for handling user authentication, including registration and login.
 */
class AuthController {
  /**
   * User Registration
   *
   * @async
   * @param {Object} req.body - The request body containing user registration data.
   * @returns {Promise<void>} Returns a JSON response with a success message and user data or an error message.
   */
  async register(req, res) {
    try {
      const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await User.create(req.body);

      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * User login
   *
   * @async
   * @param {Object} req.body - The request body containing user login data.
   * @returns {Promise<void>} Returns a JSON response with a success message and user data or an error message.
   */
  async login(req, res) {
    try {
      // Validate input
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await user.validatePassword(req.body.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
