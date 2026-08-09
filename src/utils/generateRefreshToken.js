const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

  return jwt.sign(
    { id },
    secret,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateRefreshToken;