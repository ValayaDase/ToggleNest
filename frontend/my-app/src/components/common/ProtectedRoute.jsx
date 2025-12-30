import { Navigate } from "react-router-dom"; // Redirect component
import { useAuth } from "../../context/AuthContext"; // Access auth state

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Get auth status

  if (loading) return null; 
  // Prevents route flicker while checking auth

  if (!user) {
    return <Navigate to="/" replace />; 
    // Redirects unauthenticated users
  }

  return children; 
  // Allows access if logged in
}
