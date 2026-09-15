import React, { useState } from "react";

const StudentForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (name.trim() === "") {
      setError("Name is required");
      return;
    }

    if (email.trim() === "") {
      setError("Email is required");
      return;
    }

    if (!email.trim().includes("@")) {
      setError("Invalid email format");
      return;
    }

    if (course === "") {
      setError("Course is required");
      return;
    }

    if (age === "" || Number(age) <= 0) {
      setError("Age is required");
      return;
    }

    if (editId !== null) {
      setStudents(
        students.map((student) =>
          student.id === editId
            ? { id: editId, name, email, course, age }
            : student,
        ),
      );
      setEditId(null);
    } else {
      const newStudent = {
        id: Date.now(),
        name,
        email,
        course,
        age,
      };

      setStudents([...students, newStudent]);
    }

    setName("");
    setEmail("");
    setCourse("");
    setAge("");
  };

  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
    setAge(student.age);

    setEditId(student.id);
  };

  const handleDelete = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  return (
    <div>
      <h2>Student Management System</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Course: </label>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </div>
        <br />
        <div>
          <label>Age: </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <br />
        {error && <p>{error}</p>}
        <button type="submit">
          {editId !== null ? "Update Student" : "Add Student"}
        </button>
        <br />
      </form>

      <hr />

      <h3>Student List</h3>

      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        students.map((student) => (
          <div key={student.id}>
            <h4>{student.name}</h4>

            <p>Email: {student.email}</p>
            <p>Course: {student.course}</p>
            <p>Age: {student.age}</p>

            <button onClick={() => handleEdit(student)}>Edit</button>
            <button onClick={() => handleDelete(student.id)}>Delete</button>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default StudentForm;
