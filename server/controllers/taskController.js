const db = require("../config/firebase");

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;

    await db.collection("tasks").add({
      title,
      description,
      assignedTo,
      status: "Pending",
      createdAt: Date.now(),
      createdBy: req.user.email,
    });

    res.json({ message: "Task created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GEt task 
exports.getTasks = async (req, res) => {
  try {
    let snapshot;

    // admin → all tasks
    if (req.user.role === "admin") {
      snapshot = await db.collection("tasks").get();
    } 
    // user → only assigned
    else {
      snapshot = await db
        .collection("tasks")
        .where("assignedTo", "==", req.user.email)
        .get();
    }

    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Update Task Status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.collection("tasks").doc(id).update({
      status,
    });

    res.json({ message: "Status updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Delete Task

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection("tasks").doc(id).delete();

    res.json({ message: "Task deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
