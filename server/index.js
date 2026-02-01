require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/firebase");


const { verifyToken } = require("./middleware/authMiddleware");
const { isAdmin } = require("./middleware/roleMiddleware");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Runs Success");
});

app.get("/test", async (req, res) => {
  await db.collection("test").add({ name: "yash" });
  res.send("Firestore connected success");
});

app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get("/admin-only", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});
console.log("verifyToken =>", verifyToken);
console.log("isAdmin =>", isAdmin);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
