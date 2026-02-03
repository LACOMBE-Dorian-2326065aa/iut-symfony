import { useState } from 'react';
import api from '../api/axios';
import type { Document } from '../types';
import { X, Sparkles, Loader, Copy, Check } from 'lucide-react';

interface AiQuizModalProps {
    document: Document;
    courseId: number;
    courseName: string;
    isOpen: boolean;
    onClose: () => void;
}

interface QuizData {
    name: string;
    questions: Array<{
        title: string;
        correctAnswer: 0 | 1;
    }>;
}

export default function AiQuizModal({ document, courseId, courseName, isOpen, onClose }: AiQuizModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [questionCount, setQuestionCount] = useState(5);
    const [answersPerQuestion, setAnswersPerQuestion] = useState(4);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleGenerateQuiz = async () => {
        setLoading(true);
        setError(null);
        setQuizData(null);
        try {
            const res = await api.post(`/api/ai/document-quiz/${document.id}`, {
                title: `QCM - ${courseName}`,
                question_count: questionCount,
                answers_per_question: answersPerQuestion
            });
            const data = res.data?.data as QuizData | null;
            if (data) {
                setQuizData(data);
            } else {
                setError('Format de réponse invalide de l\'IA');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la génération du QCM. Vérifiez que le PDF contient du texte.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyJson = () => {
        if (quizData) {
            navigator.clipboard.writeText(JSON.stringify(quizData, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-white" size={28} />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Générer un QCM</h2>
                            <p className="text-indigo-100 text-sm">{document.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {!quizData ? (
                        <>
                            {/* Parameters */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de questions: {questionCount}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>1</span>
                                        <span>20</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Réponses par question: {answersPerQuestion}
                                    </label>
                                    <input
                                        type="range"
                                        min="2"
                                        max="6"
                                        value={answersPerQuestion}
                                        onChange={(e) => setAnswersPerQuestion(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>2</span>
                                        <span>6</span>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {/* Generate Button */}
                            <button
                                onClick={handleGenerateQuiz}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Génération en cours...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Générer le QCM avec l'IA
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Quiz Result */}
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                ✅ QCM généré avec succès !
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-gray-900">{quizData.name}</h3>
                                    <button
                                        onClick={handleCopyJson}
                                        className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={16} /> Copié
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} /> Copier JSON
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-sm text-gray-600">
                                    {quizData.questions.length} questions générées
                                </div>

                                {/* Questions Preview */}
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {quizData.questions.map((q, idx) => (
                                        <div key={idx} className="border-l-4 border-indigo-500 pl-3 bg-white p-3 rounded">
                                            <p className="font-medium text-sm text-gray-900">Q{idx + 1}: {q.title}</p>
                                            <div className="mt-2 flex gap-4 text-sm">
                                                <span className={`px-3 py-1 rounded ${q.correctAnswer === 1 ? 'bg-green-100 text-green-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>
                                                    ✓ Vrai
                                                </span>
                                                <span className={`px-3 py-1 rounded ${q.correctAnswer === 0 ? 'bg-green-100 text-green-700 font-semibold' : 'bg-gray-100 text-gray-700'}`}>
                                                    ✕ Faux
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Full JSON */}
                                <details className="bg-white p-3 rounded border border-gray-200 cursor-pointer">
                                    <summary className="font-medium text-gray-900 select-none">
                                        Voir le JSON complet
                                    </summary>
                                    <pre className="mt-3 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                                        {JSON.stringify(quizData, null, 2)}
                                    </pre>
                                </details>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setQuizData(null);
                                        setError(null);
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Régénérer
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Fermer
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
