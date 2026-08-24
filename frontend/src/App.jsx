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
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
          </Routes>
        </main>
        
        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
