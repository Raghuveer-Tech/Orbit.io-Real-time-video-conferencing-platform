import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Meeting } from "../models/meeting.model.js";
import { signJwt } from "../utils/jwt.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: "Invalid username format" });
  }

  try {
    const normalizedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = signJwt(
        { username: user.username, name: user.name },
        "24h",
      );

      return res.status(httpStatus.OK).json({ token, name: user.name });
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid username or password" });
    }
  } catch (e) {
    return res.status(500).json({ message: "Authentication failed" });
  }
};

const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (username.length < 3) {
    return res
      .status(400)
      .json({ message: "Username must be at least 3 characters" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: normalizedUsername,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(httpStatus.CREATED)
      .json({ message: "User registered successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const getUserHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.username) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    const meetings = await Meeting.find({ user_id: req.user.username });
    return res.json(meetings);
  } catch (e) {
    return res.status(500).json({ message: "Failed to fetch history" });
  }
};

const addToHistory = async (req, res) => {
  const { meeting_code } = req.body;

  try {
    if (!req.user || !req.user.username) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    if (!meeting_code || typeof meeting_code !== "string") {
      return res.status(400).json({ message: "Meeting code is required" });
    }

    const newMeeting = new Meeting({
      user_id: req.user.username,
      meetingCode: meeting_code,
    });

    await newMeeting.save();

    return res
      .status(httpStatus.CREATED)
      .json({ message: "Added code to history" });
  } catch (e) {
    return res.status(500).json({ message: "Failed to add history" });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.user || !req.user.username) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid token" });
    }

    return res
      .status(httpStatus.OK)
      .json({ message: "Logged out successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

export { login, register, getUserHistory, addToHistory, logout };
