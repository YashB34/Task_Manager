const db = require("../config/firebase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;


//SignUp
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.collection("users").add({
      name,
      email,
      password: hashed,
      role: role || "user",
    });
    res.json({ message: "User Created Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = snapshot.docs[0].data();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
