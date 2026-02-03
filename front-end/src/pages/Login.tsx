import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, GraduationCap, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [identifier, setIdentifier] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await login(identifier, password);
            if (success) {
                navigate('/courses');
            } else {
                alert('Échec de la connexion');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                
                {/* Header Uniforme */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/10 transition-colors"></div>
                    <GraduationCap className="text-white/20 w-24 h-24 transform group-hover:scale-110 transition-transform duration-300" />
                    <h2 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                        Connexion
                    </h2>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="votre.email@exemple.com" 
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all duration-200 flex justify-center items-center gap-2 transform active:scale-[0.98] bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-100 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Pas encore de compte ? <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>S'inscrire</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;