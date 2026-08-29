const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user.model");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "complaint-secret-key",
    { expiresIn: "7d" }
  );
};

const registerUser = async (req, res) => {
try {
    const { name, email, password } = req.body; // role removed from destructure

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    if (trimmedName.length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters long." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await userModel.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Public self-registration is ALWAYS "user" — never trust role from client input.
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = await userModel.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: "user"
    });

    const token = createToken(newUser);

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: newUser.toPublicJSON()
    });
  } catch (error) {
    console.error("Register user error:", error);
    return res.status(500).json({ message: "Failed to register user." });
  }
};

// Separate, protected endpoint for role changes — mount behind requireAuth + requireAdmin middleware.
const updateUserRole = async (req, res) => {
  try {
    const allowedRoles = ["user", "staff", "admin"];
    const { role } = req.body;
    const { id } = req.params;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { role },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "Role updated.", user: updatedUser.toPublicJSON() });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({ message: "Failed to update role." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = (email || username || "").trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Email/username and password are required." });
    }

    const user = await userModel.findOne({
      $or: [{ email: loginIdentifier }, { name: loginIdentifier }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error("Login user error:", error);
    return res.status(500).json({ message: "Failed to log in." });
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user.toPublicJSON() });
};

const logoutUser = async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully." });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
};
