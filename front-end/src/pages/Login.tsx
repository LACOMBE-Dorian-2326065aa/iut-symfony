import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, GraduationCap, School, Lock, Mail } from 'lucide-react';

type LoginRole = 'student' | 'professor';

const Login = () => {
    const [role, setRole] = useState<LoginRole>('student');
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

    const isStudent = role === 'student';

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                
                {/* Header avec dégradé dynamique */}
                <div className={`h-32 bg-gradient-to-r ${isStudent ? "from-blue-500 to-indigo-600" : "from-red-500 to-rose-600"} relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-white/10 transition-colors"></div>
                    {isStudent ? (
                        <GraduationCap className="text-white/20 w-24 h-24 transform group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <School className="text-white/20 w-24 h-24 transform group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <h2 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                        Connexion {isStudent ? 'Étudiant' : 'Professeur'}
                    </h2>
                </div>

                <div className="p-8">
                    {/* Sélecteur de Rôle */}
                    <div className="flex p-1 bg-gray-50 rounded-xl mb-8 border border-gray-100">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                isStudent ? "bg-white shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <GraduationCap size={18} /> Étudiant
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('professor')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                !isStudent ? "bg-white shadow-sm text-red-600" : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <School size={18} /> Professeur
                        </button>
                    </div>

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

                        {/* Bouton de connexion avec couleur identique à la bannière */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all duration-200 flex justify-center items-center gap-2 transform active:scale-[0.98] bg-gradient-to-r ${isStudent ? "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-100" : "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-100"} disabled:opacity-70`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>

                    {/* Retour au lien d'origine pour l'inscription */}
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Pas encore de compte ? <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/register')}>S'inscrire</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;