import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Courses from './pages/Courses.tsx';
import CourseDetail from './pages/CourseDetail.tsx';
import { useAuth, AuthProvider } from './context/AuthContext';
import type { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Chargement...</div>;
    return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                <Navbar />
                <main className="container mx-auto p-4 md:p-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        
                        <Route path="/courses" element={
                            <PrivateRoute><Courses /></PrivateRoute>
                        } />
                        <Route path="/courses/:id" element={
                            <PrivateRoute><CourseDetail /></PrivateRoute>
                        } />
                        <Route path="*" element={<Navigate to="/courses" />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
}

export default App;