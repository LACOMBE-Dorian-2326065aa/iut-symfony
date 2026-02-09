import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import type { DetailedCourse, Video, Document, Quizz } from '../types';
import { BookOpen, Video as VideoIcon, FileText, Play, Clock, File, User as UserIcon, Sparkles, Plus, X, Trash2, ClipboardList, Award } from 'lucide-react';
import AiQuizModal from '../components/AiQuizModal';

const VideoCard = ({ video, isTeacher, onDelete }: { video: Video; isTeacher: boolean; onDelete: (id: number) => void }) => {
    const { id: courseId } = useParams<{ id: string }>();
    
    return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1">
        <div className="h-32 bg-gradient-to-r from-red-500 to-rose-600 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
             <Play className="absolute bottom-4 right-4 text-white/20 w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-red-600 transition-colors mb-3">
                {video.name}
            </h3>
            
            <div className="mt-auto space-y-4">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md w-fit">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">{video.duration} min</span>
                </div>

                <a 
                    href={`http://localhost:8000/uploads/${courseId}/${video.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-red-600 text-gray-700 hover:text-white rounded-lg font-medium transition-all duration-200"
                >
                    Regarder la vidéo
                </a>
                
                {isTeacher && (
                    <button 
                        onClick={() => onDelete(video.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                        <Trash2 size={16} /> Supprimer
                    </button>
                )}
            </div>
        </div>
    </div>
    );
};

const DocumentCard = ({ document, onGenerateQuiz, isTeacher, onDelete }: { document: Document; onGenerateQuiz: (document: Document) => void; isTeacher: boolean; onDelete: (id: number) => void }) => {
    const { id: courseId } = useParams<{ id: string }>();
    
    return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
             <FileText className="absolute bottom-4 right-4 text-white/20 w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-emerald-600 transition-colors mb-3">
                {document.name}
            </h3>

            <div className="mt-auto space-y-4">
                 <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md w-fit">
                    <File size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">{document.numberOfPages} pages</span>
                </div>

                {document.user && (
                     <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md w-fit">
                        <UserIcon size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">
                            {document.user.firstname} {document.user.lastname}
                        </span>
                    </div>
                )}

                <a 
                    href={`http://localhost:8000/uploads/${courseId}/${document.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-emerald-600 text-gray-700 hover:text-white rounded-lg font-medium transition-all duration-200"
                >
                    Télécharger
                </a>
                {onGenerateQuiz && (
                    <button
                        type="button"
                        onClick={() => onGenerateQuiz(document)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg font-medium transition-all duration-200 border border-indigo-200 hover:border-indigo-600"
                    >
                        <Sparkles size={18} />
                        Générer un QCM
                    </button>
                )}

                {isTeacher && (
                    <button 
                        onClick={() => onDelete(document.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                    >
                        <Trash2 size={16} /> Supprimer
                    </button>
                )}
            </div>
        </div>
    </div>
    );
};

const QuizCard = ({ quiz, courseId }: { quiz: Quizz; courseId: number }) => {
    return (
        <Link 
            to={`/quiz/${quiz.id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1"
        >
            <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
                <ClipboardList className="absolute bottom-4 right-4 text-white/20 w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors mb-3">
                    {quiz.name}
                </h3>
                
                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md w-fit">
                        <Award size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">QCM disponible</span>
                    </div>

                    <div className="w-full text-center py-2.5 px-4 bg-blue-600 group-hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200">
                        Passer le QCM
                    </div>
                </div>
            </div>
        </Link>
    );
};

const CourseDetail = () => {
    const { id } = useParams<{ id: string }>(); 
    const { user } = useAuth();
    const [course, setCourse] = useState<DetailedCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [showVideoForm, setShowVideoForm] = useState(false);
    const [videoName, setVideoName] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [showDocForm, setShowDocForm] = useState(false);
    const [docName, setDocName] = useState('');
    const [docPages, setDocPages] = useState('');
    const [docFile, setDocFile] = useState<File | null>(null);

    const isTeacher = user?.roles.includes('role_teacher') || user?.roles.includes('ROLE_TEACHER');

    const fetchCourse = async () => {
        if (!id) return;
        try {
           const res = await api.get<DetailedCourse>(`/api/course/${id}`);
           setCourse(res.data);
       } catch (err) {
           console.error(err);
       } finally {
           setLoading(false);
       }
   };

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const handleVideoUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile || !videoName || !course) return;
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('video', videoFile);
            
            await api.post(`/api/video/upload/${course.id}/${videoName}`, formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowVideoForm(false);
            setVideoName('');
            setVideoFile(null);
            await fetchCourse();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de l\'upload');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDocUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!docFile || !docName || !docPages || !course) return;
        setIsUploading(true);
        
        try {
            const reader = new FileReader();
            reader.readAsDataURL(docFile);
            reader.onload = async () => {
                const base64File = reader.result?.toString().split(',')[1];
                await api.post('/api/document/upload', {
                   file: base64File,
                   name: docName,
                   courseId: course.id,
                   numberOfPages: parseInt(docPages),
                   userId: user?.id 
                });
                setShowDocForm(false);
                setDocName('');
                setDocPages('');
                setDocFile(null);
                await fetchCourse();
                setIsUploading(false);
            };
        } catch (err) {
            console.error(err);
            setIsUploading(false);
            alert('Erreur lors de l\'upload');
        } 
    };

    const handleDeleteVideo = async (videoId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) return;
        try {
            await api.delete(`/api/videos/${videoId}`);
            await fetchCourse();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression');
        }
    };

    const handleDeleteDocument = async (docId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
        try {
            await api.delete(`/api/documents/${docId}`);
            await fetchCourse();
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!course) return <div className="p-4 text-center">Cours introuvable</div>;

    const handleGenerateQuiz = (document: Document) => {
        setSelectedDocument(document);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDocument(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">{course.name}</h1>
                <div className="flex justify-center gap-4">
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        {course.videos.items.length} Vidéos
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                        {course.documents.items.length} Documents
                    </span>
                </div>
            </div>

            {isTeacher && (
                <div className="space-y-6">
                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={() => { setShowVideoForm(!showVideoForm); setShowDocForm(false); }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            <Plus size={20} /> Ajouter une vidéo
                        </button>
                        <button 
                            onClick={() => { setShowDocForm(!showDocForm); setShowVideoForm(false); }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            <Plus size={20} /> Ajouter un document
                        </button>
                    </div>

                    {showVideoForm && (
                        <form onSubmit={handleVideoUpload} className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto space-y-4 animate-fade-in-down">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-800">Ajouter une vidéo</h3>
                                <button type="button" onClick={() => setShowVideoForm(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
                            </div>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Nom de la vidéo" 
                                    value={videoName}
                                    onChange={e => setVideoName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                                <input 
                                    type="file" 
                                    accept="video/mp4"
                                    onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isUploading}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
                                >
                                    {isUploading ? 'Chargement...' : 'Enregistrer la vidéo'}
                                </button>
                            </div>
                        </form>
                    )}

                    {showDocForm && (
                        <form onSubmit={handleDocUpload} className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto space-y-4 animate-fade-in-down">
                             <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg text-gray-800">Ajouter un document</h3>
                                <button type="button" onClick={() => setShowDocForm(false)} className="text-gray-400 hover:text-emerald-500"><X size={20}/></button>
                            </div>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="Nom du document" 
                                    value={docName}
                                    onChange={e => setDocName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                                <input 
                                    type="number" 
                                    placeholder="Nombre de pages" 
                                    value={docPages}
                                    onChange={e => setDocPages(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                    min="1"
                                />
                                <input 
                                    type="file" 
                                    accept="application/pdf"
                                    onChange={e => setDocFile(e.target.files ? e.target.files[0] : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isUploading}
                                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
                                >
                                    {isUploading ? 'Chargement...' : 'Enregistrer le document'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        
            {/* Section Vidéos */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <VideoIcon className="text-red-500" /> Vidéos du cours
                </h2>
                {course.videos.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {course.videos.items.map(video => (
                            <VideoCard 
                                key={video.id} 
                                video={video} 
                                isTeacher={isTeacher || false}
                                onDelete={handleDeleteVideo}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Aucune vidéo associée à ce cours.</p>
                )}
            </section>

            {/* Section Documents */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="text-emerald-500" /> Documents du cours
                </h2>
                 {course.documents.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {course.documents.items.map((doc) => (
                            <DocumentCard 
                                key={doc.id} 
                                document={doc} onGenerateQuiz={handleGenerateQuiz} 
                                isTeacher={isTeacher || false}
                                onDelete={handleDeleteDocument}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Aucun document associé à ce cours.</p>
                )}
            </section>

            {/* Section QCM */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ClipboardList className="text-blue-500" /> QCM disponibles
                </h2>
                {course.quizzs.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {course.quizzs.items.map((quiz) => (
                            <QuizCard 
                                key={quiz.id} 
                                quiz={quiz} 
                                courseId={course.id}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                        <ClipboardList className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2 font-medium">Aucun QCM disponible pour ce cours</p>
                        {isTeacher && (
                            <p className="text-sm text-gray-500">Générez un QCM à partir d'un document en cliquant sur "Générer un QCM"</p>
                        )}
                    </div>
                )}
            </section>

            {selectedDocument && (
                <AiQuizModal 
                    document={selectedDocument}
                    courseId={course.id}
                    courseName={course.name}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default CourseDetail;