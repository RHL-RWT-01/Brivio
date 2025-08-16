import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import AllRecordings from "./components/AllRecordings";
import NewRecording from "./components/NewRecording";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

function App() {
  // Temporary mocked auth state
  const isLoading = false;
  const authUser = { name: "Test User" }; // change to null when logged out

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {authUser && <Sidebar />}

      <div className="flex-1 p-4">
        <Routes>
          {/* Protected Routes */}
          {authUser ? (
            <>
              <Route path="/" element={<Navigate to="/new" replace />} />
              <Route path="/new" element={<NewRecording />} />
              <Route path="/all" element={<AllRecordings />} />
            </>
          ) : (
            <>
              {/* Redirect to login if not logged in */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </>
          )}

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
