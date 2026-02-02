import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">EduLearn</Link>
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link to="/courses" className="hover:text-blue-200">Cours</Link>
                            <Link to="/my-results" className="hover:text-blue-200">Mes Notes</Link>
                            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="hover:text-blue-200">Connexion</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;