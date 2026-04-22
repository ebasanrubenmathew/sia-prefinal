const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


let students = [
    { id: 1, name: "Angeloyobmot", yearLevel: 2 },
    { id: 2, name: "Angelodingba", yearLevel: 2 },
    { id: 3, name: "Angelogay", yearLevel: 2 }
];


app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});


app.get('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
});


app.post('/api/students', (req, res) => {
    const { name, yearLevel } = req.body;

    if (!name || !yearLevel) {
        return res.status(400).json({ message: "Name and yearLevel required" });
    }


    const newId = students.length > 0 
        ? Math.max(...students.map(s => s.id)) + 1 
        : 1;

    const newStudent = {
        id: newId,
        name,
        yearLevel
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});


app.put('/api/students/:id', (req, res) => {
    const student = students.find(s => s.id == req.params.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, yearLevel } = req.body;

    if (name) student.name = name;
    if (yearLevel) student.yearLevel = yearLevel;

    res.status(200).json({
        message: "Student updated successfully",
        student
    });
});


app.delete('/api/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    const deleted = students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully",
        student: deleted[0]
    });
});

app.get('/api/students/search/:name', (req, res) => {
    const result = students.filter(s =>
        s.name.toLowerCase().includes(req.params.name.toLowerCase())
    );

    if (result.length === 0) {
        return res.status(404).json({ message: "No matching students found" });
    }

    res.status(200).json(result);
});


app.get('/api/students/year/:yearLevel', (req, res) => {
    const result = students.filter(s => s.yearLevel == req.params.yearLevel);

    if (result.length === 0) {
        return res.status(404).json({ message: "No students found for this year level" });
    }

    res.status(200).json(result);
});


app.get('/api/students/stats', (req, res) => {
    res.status(200).json({
        totalStudents: students.length
    });
});


app.get('/api/students/random', (req, res) => {
    if (students.length === 0) {
        return res.status(404).json({ message: "No students available" });
    }

    const random = students[Math.floor(Math.random() * students.length)];
    res.status(200).json(random);
});


app.get('/api/students/top', (req, res) => {
    if (students.length === 0) {
        return res.status(404).json({ message: "No students available" });
    }

    const top = students.reduce((prev, current) =>
        (prev.yearLevel > current.yearLevel) ? prev : current
    );

    res.status(200).json(top);
});


app.get('/api/students/latest', (req, res) => {
    if (students.length === 0) {
        return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json(students[students.length - 1]);
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Server error" });
});

// ================= START SERVER =================
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});