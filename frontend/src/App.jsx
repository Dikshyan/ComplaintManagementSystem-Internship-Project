import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProblemsFeed } from './pages/ProblemsFeed';
import { ProblemDetails } from './pages/ProblemDetails';
import { SubmitComplaint } from './pages/SubmitComplaint';
import { LoginRegister } from './pages/LoginRegister';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
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
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/register" element={<LoginRegister />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;