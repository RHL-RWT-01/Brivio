import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Loader from "./components/Loader";
import AllRecordings from "./components/Recording/AllRecordings";
import NewRecording from "./components/Recording/NewRecording";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { useQuery } from "@tanstack/react-query";

function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch user data");
      }
    },
    retry: false,
  });

  

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

      <div className="flex-1 ">
        <Routes>
          {/* Public Routes - Redirect authenticated users away from these */}
          <Route
            path="/login"
            element={authUser ? <Navigate to="/all" replace /> : <Login />}
          />
          <Route
            path="/signup"
            element={authUser ? <Navigate to="/all" replace /> : <Signup />}
          />

          {/* Protected Routes - Redirect unauthenticated users to login */}
          <Route
            path="/new"
            element={authUser ? <NewRecording /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/all"
            element={authUser ? <AllRecordings /> : <Navigate to="/login" replace />}
          />

          {/* Default route for authenticated users */}
          <Route
            path="/"
            element={authUser ? <Navigate to="/all" replace /> : <Navigate to="/login" replace />}
          />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/all" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
