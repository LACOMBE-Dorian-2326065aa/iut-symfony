import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { DetailedQuizz, Question, HydraResponse } from '../types';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const QuizDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState<DetailedQuizz | null>(null);
    const [answers, setAnswers] = useState<Record<number, boolean>>({}); 
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (!id) return;
            try {
                const detailRes = await api.get<DetailedQuizz>(`/api/quizz/${id}`);
                setQuiz(detailRes.data);
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement du QCM.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    const handleAnswerChange = (questionId: number, value: boolean) => {
        if (submitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const calculateScore = () => {
        if (!quiz) return 0;
        let correctCount = 0;
        quiz.questions.items.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        return Math.round((correctCount / quiz.questions.items.length) * 20); // Score sur 20
    };

    const handleSubmit = async () => {
        if (!quiz || !user) return;
        
        if (Object.keys(answers).length < quiz.questions.items.length) {
            alert("Veuillez répondre à toutes les questions.");
            return;
        }

        if (!confirm("Voulez-vous vraiment valider le QCM ?")) return;

        const calculatedScore = calculateScore();
        setScore(calculatedScore);
        setSubmitted(true);

        try {
            await api.post('/api/quizz_attempts', {
                quizz: `/api/quizzs/${quiz.id}`,
                user: `/api/users/${user.id}`,
                note: calculatedScore,
                date: new Date().toISOString()
            });

        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement du résultat.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
             <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                <p className="text-xl text-gray-600 mb-6">{error || "Erreur inconnue"}</p>
                <button 
                    onClick={() => navigate(`/courses/${quiz?.course.id}`)}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    <ArrowLeft size={20} /> Retour au cours (Problème de navigation)
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{quiz.name}</h1>
                <button 
                     onClick={() => navigate(`/courses/${quiz.course.id}`)}
                     className="text-gray-500 hover:text-gray-700 font-medium"
                >
                    Retour au cours
                </button>
            </div>

            <div className="space-y-6">
                {quiz.questions.items.map((question, index) => {
                    const isCorrect = submitted && answers[question.id] === question.correctAnswer;
                    const isWrong = submitted && answers[question.id] !== question.correctAnswer;

                    return (
                        <div key={question.id} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${
                            submitted 
                                ? (isCorrect ? 'border-emerald-500' : 'border-red-500') 
                                : 'border-blue-500'
                        }`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-gray-800">
                                    Question {index + 1} : {question.title}
                                </h3>
                                {submitted && (
                                    isCorrect 
                                        ? <CheckCircle className="text-emerald-500" /> 
                                        : <XCircle className="text-red-500" />
                                )}
                            </div>

                            <div className="flex gap-6">
                                <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border flex-1 transition-all ${
                                    answers[question.id] === true 
                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name={`q-${question.id}`} 
                                        checked={answers[question.id] === true}
                                        onChange={() => handleAnswerChange(question.id, true)}
                                        disabled={submitted}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="font-medium text-gray-700">Vrai</span>
                                </label>

                                <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border flex-1 transition-all ${
                                    answers[question.id] === false 
                                        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name={`q-${question.id}`} 
                                        checked={answers[question.id] === false}
                                        onChange={() => handleAnswerChange(question.id, false)}
                                        disabled={submitted}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="font-medium text-gray-700">Faux</span>
                                </label>
                            </div>
                            
                            {submitted && isWrong && (
                                <p className="mt-4 text-sm text-red-600 font-medium">
                                    La bonne réponse était : {question.correctAnswer ? 'Vrai' : 'Faux'}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 mb-20 text-center">
                {!submitted ? (
                    <button 
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition shadow-lg"
                    >
                        Valider le QCM
                    </button>
                ) : (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="inline-block p-6 bg-white rounded-xl shadow-md border border-gray-100">
                            <p className="text-gray-500 uppercase tracking-wide text-sm font-bold mb-1">Votre Note</p>
                            <p className={`text-4xl font-extrabold ${
                                (score || 0) >= 10 ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                                {score} / 20
                            </p>
                        </div>
                        <div>
                             <button 
                                onClick={() => navigate(`/courses/${quiz.course.id}`)}
                                className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                            >
                                Retour au cours
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizDetail;
