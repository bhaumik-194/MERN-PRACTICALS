
import { useEffect, useState } from "react";
import axios from "axios";
import { X, UserPlus, Pencil } from "lucide-react";

const API_URL = "http://localhost:5000/api/students";

function StudentForm({ student, onClose, onStudentAdded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    semester: "1",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        course: student.course,
        semester: String(student.semester),
      });
    }
  }, [student]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        ...form,
        semester: Number(form.semester),
      };

      if (student) {
        await axios.put(`${API_URL}/${student._id}`, data);
      } else {
        await axios.post(API_URL, data);
      }

      onStudentAdded();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not save student."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-card">
        <div className="form-heading">
          <div>
            <div className="form-icon">
              {student ? <Pencil size={22} /> : <UserPlus size={22} />}
            </div>
            <h2>{student ? "Edit Student" : "Add New Student"}</h2>
            <p>
              {student
                ? "Update the student's information."
                : "Enter the student's details below."}
            </p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
            required
          />

          <label htmlFor="course">Course</label>
          <select
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          >
            <option value="">Select course</option>
            <option value="MSc CA & IT">MSc CA & IT</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="BSc CA & IT">BSc CA & IT</option>
            <option value="BTech">BTech</option>
          </select>

          <label htmlFor="semester">Semester</label>
          <select
            id="semester"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : student
                  ? "Update Student"
                  : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
