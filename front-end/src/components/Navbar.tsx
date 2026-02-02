import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, BookOpen, LogIn, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-blue-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group text-white">
                        <div className="bg-white/10 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                           <GraduationCap size={28} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                            EduLearn
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-8">
                        {user ? (
                            <>
                                <Link 
                                    to="/courses" 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                                        isActive('/courses') 
                                            ? 'bg-blue-800 text-white shadow-inner' 
                                            : 'text-blue-100 hover:bg-blue-500 hover:text-white hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                >
                                    <BookOpen size={20} />
                                    Cours
                                </Link>
                                
                                <Link 
                                    to="/my-results" 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                                        isActive('/my-results') 
                                            ? 'bg-blue-800 text-white shadow-inner' 
                                            : 'text-blue-100 hover:bg-blue-500 hover:text-white hover:shadow-md hover:-translate-y-0.5'
                                    }`}
                                >
                                    <LayoutDashboard size={20} />
                                    Mes Notes
                                </Link>

                                <div className="h-8 w-px bg-blue-500 mx-2"></div>

                                <div className="flex items-center gap-6">
                                     <span className="hidden md:block text-base font-medium text-blue-50">
                                        {user.firstname || user.email}
                                     </span>
                                    
                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-md hover:shadow-lg transition-all duration-200 text-sm font-bold"
                                        title="Se déconnecter"
                                    >
                                        <LogOut size={18} />
                                        <span className="hidden sm:inline">Déconnexion</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-bold text-base"
                            >
                                <LogIn size={20} />
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;