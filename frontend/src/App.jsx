import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProblemsFeed } from './pages/ProblemsFeed';
import { ProblemDetails } from './pages/ProblemDetails';
import { MyGrievanceDetails } from './pages/MyGrievanceDetails';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { LoginRegister } from './pages/LoginRegister';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Toasts */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

        {/* Global Navigation Header */}
        <Header />
        
        {/* Main Content Area */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<ProblemsFeed />} />
            <Route path="/problems/:id" element={<ProblemDetails />} />
            
            {/* Protected Routes (Authentication Layer Required) */}
            <Route path="/my-grievance/:id" element={
              <ProtectedRoute>
                <MyGrievanceDetails />
              </ProtectedRoute>
            } />
            <Route path="/submit" element={
              <ProtectedRoute roleRequired="user">
                <SubmitComplaint />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/staff" element={
              <ProtectedRoute roleRequired="staff">
                <StaffDashboard />
              </ProtectedRoute>
            } />

            <Route path="/login" element={<LoginRegister />} />
            <Route path="/register" element={<LoginRegister />} />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;