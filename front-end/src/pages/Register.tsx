import { useState, type FormEvent } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, GraduationCap, School, Lock, Mail, User } from 'lucide-react';

type RegisterRole = 'student' | 'professor';

const Register = () => {
    const [role, setRole] = useState<RegisterRole>('student');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/api/register', {
                email,
                password,
                firstname,
                lastname,
                roles: role === 'professor' ? ['ROLE_TEACHER'] : ['ROLE_STUDENT']
            });
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    const isStudent = role === 'student';

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                
                <div className={`h-32 bg-gradient-to-r ${isStudent ? "from-blue-500 to-indigo-600" : "from-red-500 to-rose-600"} relative overflow-hidden flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-white/10 transition-colors"></div>
                    {isStudent ? (
                        <GraduationCap className="text-white/20 w-24 h-24 transform group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                        <School className="text-white/20 w-24 h-24 transform group-hover:scale-110 transition-transform duration-300" />
                    )}
                    <h2 className="absolute bottom-4 left-6 text-2xl font-bold text-white">
                        Inscription {isStudent ? 'Étudiant' : 'Professeur'}
                    </h2>
                </div>

                <div className="p-8">
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
                       <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Jean" 
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nom</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Dupont" 
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="email" 
                                    placeholder="votre.email@exemple.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                            className={`w-full text-white py-3.5 rounded-xl font-bold shadow-lg transition-all duration-200 flex justify-center items-center gap-2 transform active:scale-[0.98] bg-gradient-to-r ${isStudent ? "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-100" : "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-100"} disabled:opacity-70`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "S'inscrire"
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-sm text-gray-500">
                        Déjà un compte ? <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Se connecter</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;