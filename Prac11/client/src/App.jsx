import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import {
  GraduationCap,
  Users,
  Search,
  Plus,
  RefreshCw,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import "./App.css";
import StudentForm from "./components/StudentForm";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load students. Check your backend.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const courses = new Set(students.map((student) => student.course)).size;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>
          <div>
            <h2>EduManage</h2>
            <span>Student Portal</span>
          </div>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">
          <BookOpen size={19} />
          <span>Students</span>
        </div>

        <div className="sidebar-footer">
          <div className="status-dot" />
          <span>Student database</span>
          <strong>API</strong>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">MANAGEMENT / STUDENTS</p>
            <h1>Student Management</h1>
            <p className="subtitle">Manage student records from one place.</p>
          </div>

          <button className="secondary-btn" onClick={fetchStudents}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Users size={21} />
            </div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
            <span>Registered records</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <BookOpen size={21} />
            </div>
            <p>Courses</p>
            <h2>{courses}</h2>
            <span>Unique courses</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <GraduationCap size={21} />
            </div>
            <p>Current Semester</p>
            <h2>
              {students.length
                ? Math.round(
                    students.reduce(
                      (total, student) => total + student.semester,
                      0,
                    ) / students.length,
                  )
                : "—"}
            </h2>
            <span>Average semester</span>
          </div>
        </section>

        {showForm && (
          <StudentForm
            student={editingStudent}
            onClose={() => {
              setShowForm(false);
              setEditingStudent(null);
            }}
            onStudentAdded={() => {
              setShowForm(false);
              setEditingStudent(null);
              fetchStudents();
            }}
          />
        )}
        <section className="students-panel">
          <div className="panel-heading">
            <div>
              <h2>All Students</h2>
              <p>View and search registered students.</p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setEditingStudent(null);
                setShowForm(true);
              }}
            >
              <Plus size={18} />
              Add Student
            </button>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or course..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {loading ? (
            <div className="empty-state">Loading students...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Users size={26} />
              </div>
              <h3>{search ? "No matching students" : "No students yet"}</h3>
              <p>
                {search
                  ? "Try another search term."
                  : "Your student records will appear here once added."}
              </p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>STUDENT</th>
                    <th>EMAIL</th>
                    <th>COURSE</th>
                    <th>SEMESTER</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <strong>{student.name}</strong>
                        </div>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span className="course-badge">{student.course}</span>
                      </td>
                      <td>Semester {student.semester}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="icon-btn edit-btn"
                            title="Edit student"
                            aria-label={`Edit ${student.name}`}
                            onClick={() => {
                              setEditingStudent(student);
                              setShowForm(true);
                            }}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="icon-btn delete-btn"
                            title="Delete student"
                            aria-label={`Delete ${student.name}`}
                            onClick={async () => {
                              const confirmed = window.confirm(
                                `Are you sure you want to delete ${student.name}?`,
                              );

                              if (!confirmed) return;

                              try {
                                await axios.delete(`${API_URL}/${student._id}`);
                                await fetchStudents();
                              } catch (err) {
                                setError(
                                  err.response?.data?.message ||
                                    "Could not delete student.",
                                );
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>EduManage · Student Management System</span>
          <span>React + Express + MongoDB</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
