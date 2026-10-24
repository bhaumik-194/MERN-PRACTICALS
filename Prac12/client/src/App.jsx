
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBlogs from "./pages/MyBlogs";
import BlogForm from "./pages/BlogForm";
import BlogDetails from "./pages/BlogDetails";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/blogs/new" element={<BlogForm />} />
            <Route path="/blogs/:id/edit" element={<BlogForm />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route
            path="*"
            element={
              <main className="page-container">
                <h1>404 — Page Not Found</h1>
                <a href="/">Return Home</a>
              </main>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
