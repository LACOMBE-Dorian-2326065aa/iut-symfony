import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { QuizzAttempt, ApiResponse } from '../types';
import { FileQuestion, Calendar, CheckCircle } from 'lucide-react';

const Results = () => {
    const { user } = useAuth();
    const [attempts, setAttempts] = useState<QuizzAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
             try {
                const res = await api.get<ApiResponse<QuizzAttempt>>('/api/quizz-attempt');
                const myAttempts = res.data.items.filter(attempt => attempt.user.email === user?.email);
                myAttempts.sort((a, b) => {
                    const dateA = new Date(typeof a.date === 'string' ? a.date : a.date.date).getTime();
                    const dateB = new Date(typeof b.date === 'string' ? b.date : b.date.date).getTime();
                    return dateB - dateA;
                });
                setAttempts(myAttempts);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchResults();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (attempts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="bg-gray-100 p-6 rounded-full">
                    <FileQuestion size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700">Aucune note pour le moment</h2>
                <p className="text-gray-400">Vos résultats de QCM apparaîtront ici.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="border-b pb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <CheckCircle className="text-emerald-500" size={32} /> 
                    Mes Résultats
                </h1>
                <p className="mt-2 text-gray-500 text-lg">Suivez votre progression et vos scores aux évaluations.</p>
            </header>
            
            <div className="grid gap-5">
                {attempts.map((attempt) => (
                    <div key={attempt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {attempt.quizz.name}
                            </h3>
                            <p className="text-gray-500 font-medium">{attempt.quizz.course.name}</p>
                            <div className="flex items-center gap-2 pt-1 text-sm text-gray-400">
                                <Calendar size={14} />
                                <span>
                                    {typeof attempt.date === 'string' 
                                        ? new Date(attempt.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                                        : attempt.date?.date 
                                            ? new Date(attempt.date.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                                            : 'Date inconnue'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 self-end sm:self-center">
                             <div className={`text-3xl font-black px-5 py-2 rounded-xl border-2 flex items-baseline gap-1 ${
                                attempt.note >= 15 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                attempt.note >= 10 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                {attempt.note}<span className="text-sm font-semibold opacity-60">/20</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Results;
