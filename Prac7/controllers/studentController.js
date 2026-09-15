let students = [
     {
    id: 1,
    name: "Bhaumik",
    age: 21,
    course: "B.Sc. IT"
  },
  {
    id: 2,
    name: "Shaurya",
    age: 20,
    course: "BCA"
  }
];

const getStudents = (req, res) => {
    res.json(students);
}

const getStudentById = (req, res) => {
    const id = parseInt(req.params.id);

    const student = students.find((student) => student.id === id);
    if(!student){
        return res.status(404).json({
            message: "Student not found"
        });
    }
    res.json(student);
}

//ADD

const addStudent = (req, res) => {
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        age: req.body.age,
        course: req.body.course,
    };
    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully.",
        student: newStudent
    });
};

//UPDATE
const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find((student) => student.id == id);

    if(!student){
        return res.status(404).json({
            message: "Student not found"
        });
    }
    student.name = req.body.name;
    student.age= req.body.age;
    student.course = req.body.course;

    res.json({
        message: "Student updated successfully.",
        student: student
    });
};

//DELETE

const deleteStudent = (req, res) => {
    const id = parseInt(req.params.id);

    const studentExists = students.some((student)=>student.id===id);

    if(!studentExists) {
        return res.status(404).json({
            message: "Student not found"
        });
    }
    students = students.filter((student) => student.id !== id);

    res.json({
        message: "Student deleted successfully"
    });
}

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
};

