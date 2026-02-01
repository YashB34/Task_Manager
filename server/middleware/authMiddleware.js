const jwt = require("jsonwebtoken");

const SECRET = "yashsecret";

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, SECRET);

    req.user = decoded; 

    next(); 

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
