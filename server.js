const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// in-memory data (OK for demo)
let students = [
  { id: 1, name: "Angeloyobmot", yearLevel: 2 },
  { id: 2, name: "Angelodingba", yearLevel: 2 },
  { id: 3, name: "Angelogay", yearLevel: 2 }
];

// GET ALL
app.get("/api/students", (req, res) => {
  res.json(students);
});

// ADD
app.post("/api/students", (req, res) => {
  const { name, yearLevel } = req.body;

  if (!name || !yearLevel) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newStudent = {
    id: students.length ? students[students.length - 1].id + 1 : 1,
    name,
    yearLevel
  };

  students.push(newStudent);

  res.json(newStudent);
});

// DELETE
app.delete("/api/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Not found" });
  }

  const deleted = students.splice(index, 1);

  res.json(deleted[0]);
});

// UPDATE
app.put("/api/students/:id", (req, res) => {
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Not found" });
  }

  const { name, yearLevel } = req.body;

  if (name) student.name = name;
  if (yearLevel) student.yearLevel = yearLevel;

  res.json(student);
});

// START SERVER (IMPORTANT FOR RENDER)
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});