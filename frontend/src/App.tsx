import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthPage from "./components/authPage";
import UsersPage from "./components/userPage";
import DashboardPage from "./components/dashboardPage";
import TasksPage from "./components/taskPage";
import { useAuth } from "./contexts/auth-context";
// HomePage component
function HomePage() {
  const navigate = useNavigate();
  // Replace with your actual auth logic
  const { user, loading } = useAuth(); // Mock implementation

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/tasks" element={<TasksPage />} /> */}

      {/* Add more routes as needed */}
    </Routes>
  );
}

export default App;