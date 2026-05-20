import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MealUpload from './pages/MealUpload';
import AICoach from './pages/AICoach';
import Analytics from './pages/Analytics';
import WorkoutTracker from './pages/WorkoutTracker';
import SocialChallenges from './pages/SocialChallenges';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#070A13]">
        {/* Futuristic Glassmorphic Top Nav */}
        <Navbar />

        {/* Core Layout Wrapper */}
        <div className="flex-1 flex flex-col lg:flex-row relative">
          
          <Routes>
            {/* Unprotected Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Core Ecosystem */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex-1 flex flex-col lg:flex-row min-h-full">
                    {/* Left Sidebar on large screen / Floating menu on mobile */}
                    <Sidebar />
                    
                    {/* Main responsive route viewport */}
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/meal-upload" element={<MealUpload />} />
                        <Route path="/coach" element={<AICoach />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/workouts" element={<WorkoutTracker />} />
                        <Route path="/social-challenges" element={<SocialChallenges />} />
                        
                        {/* Catch-all sends straight to home dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
