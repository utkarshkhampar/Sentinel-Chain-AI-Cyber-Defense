const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const generateRefreshToken = require("../utils/generateRefreshToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = await bcrypt.hash(refreshToken, 10);
    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    const decoded = jwt.verify(refreshToken, secret);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || !user.refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    res.status(200).json({
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+refreshToken");

    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Local testing ke liye token response mein hai.
    res.status(200).json({
      message: "Password reset token created",
      resetToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "Reset token is invalid or expired",
      });
    }

    const { password } = req.body;

   if (!password) {
  return res.status(400).json({
    message: "New password is required",
  });
}

user.password = await bcrypt.hash(password, 10);
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
user.refreshToken = undefined;
await user.save();

res.status(200).json({
  message: "Password reset successfully",
});
} catch (error) {
  res.status(500).json({
    message: error.message,
  });
}
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
};