import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Income from "./pages/Income.jsx";
import Expense from "./pages/Expense.jsx";
import Category from "./pages/Category.jsx";
import Filter from "./pages/Filter.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};


const App = () => {
    return (
        <ErrorBoundary>
            <Toaster />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Root />} />
                    <Route
                        path="/home"
                        element={
                            <PublicRoute>
                                <LandingPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/income"
                        element={
                            <ProtectedRoute>
                                <Income />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/expense"
                        element={
                            <ProtectedRoute>
                                <Expense />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/category"
                        element={
                            <ProtectedRoute>
                                <Category />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/filter"
                        element={
                            <ProtectedRoute>
                                <Filter />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    )
}

const Root = () => {
    const isAuthenticated = !!localStorage.getItem("token");
    return isAuthenticated ? (
        <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/home" />
    );
}

export default App;