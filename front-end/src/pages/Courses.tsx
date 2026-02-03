import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Course, Video, ApiResponse } from '../types';
import { Link } from 'react-router-dom';
import { BookOpen, Video as Play, Clock, Film, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course }: { course: Course }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
             <BookOpen className="absolute bottom-4 right-4 text-white/20 w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {course.name}
                </h3>
            </div>

            <div className="mt-auto space-y-4">
                <Link 
                    to={`/courses/${course.id}`} 
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-blue-600 text-gray-700 hover:text-white rounded-lg font-medium transition-all duration-200"
                >
                    Voir le contenu
                </Link>
            </div>
        </div>
    </div>
);

const VideoCard = ({ video }: { video: Video }) => (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1">
        <div className="h-32 bg-gradient-to-r from-red-500 to-rose-600 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors"></div>
             <Play className="absolute bottom-4 right-4 text-white/20 w-16 h-16 transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-red-600 transition-colors">
                    {video.name}
                </h3>
            </div>
            
            <div className="mt-auto space-y-4">
                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                   <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <Clock size={14} className="text-gray-400" />
                        <span>{video.duration} min</span>
                   </div>
                </div>

                <a 
                    href={`http://localhost:8000/uploads/${video.courseId}/${video.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-red-600 text-gray-700 hover:text-white rounded-lg font-medium transition-all duration-200"
                >
                    Regarder la vidéo
                </a>
            </div>
        </div>
    </div>
);

const Courses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseName, setCourseName] = useState('');
    
    const [videoName, setVideoName] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);

    const [docName, setDocName] = useState('');
    const [docPages, setDocPages] = useState('');
    const [docFile, setDocFile] = useState<File | null>(null);

    const isTeacher = user?.roles.includes('role_teacher') || user?.roles.includes('ROLE_TEACHER');

    const fetchData = async () => {
        try {
            const [coursesRes, videosRes] = await Promise.all([
                api.get<ApiResponse<Course>>('/api/course'),
                api.get<ApiResponse<Video>>('/api/video')
            ]);
            setCourses(coursesRes.data.items || []);
            setVideos(videosRes.data.items || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Create Course
            const res = await api.post<Course>('/api/courses', { name: courseName });
            const newCourse = res.data;

            // 2. Upload Video if exists
            if (videoFile && videoName) {
                const formData = new FormData();
                formData.append('video', videoFile);
                 await api.post(`/api/video/upload/${newCourse.id}/${videoName}`, formData, {
                     headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            // 3. Upload Document if exists
            if (docFile && docName && docPages) {
                 const reader = new FileReader();
                 reader.readAsDataURL(docFile);
                 await new Promise<void>((resolve, reject) => {
                    reader.onload = async () => {
                        try {
                            const base64File = reader.result?.toString().split(',')[1];
                            await api.post('/api/document/upload', {
                                file: base64File,
                                name: docName,
                                courseId: newCourse.id,
                                numberOfPages: parseInt(docPages),
                                userId: user?.id 
                            });
                            resolve();
                        } catch (e) { reject(e); }
                    };
                    reader.onerror = reject;
                 });
            }

            // Reset and refresh
            setCourseName('');
            setVideoName('');
            setVideoFile(null);
            setDocName('');
            setDocPages('');
            setDocFile(null);
            setShowForm(false);
            await fetchData();
            alert('Cours créé avec succès !');

        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création du cours");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">            
            {isTeacher && (
                <div className="flex flex-col items-center gap-6">
                    {!showForm ? (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-bold shadow-lg transform hover:scale-105"
                        >
                            <Plus size={20} /> Ajouter un nouveau cours
                        </button>
                    ) : (
                        <form onSubmit={handleCreateCourse} className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in-down">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Nouveau Cours</h2>
                                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X size={24}/></button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du cours *</label>
                                    <input 
                                        type="text" 
                                        value={courseName}
                                        onChange={e => setCourseName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                        placeholder="Ex: Mathématiques Avancées"
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2"><Play size={18}/> Ajouter une Vidéo (Optionnel)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Titre de la vidéo"
                                            value={videoName}
                                            onChange={e => setVideoName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                        />
                                        <input 
                                            type="file" 
                                            accept="video/mp4"
                                            onChange={e => setVideoFile(e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
                                    <h3 className="font-semibold text-gray-700 flex items-center gap-2"><BookOpen size={18}/> Ajouter un Document (Optionnel)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Titre du document"
                                            value={docName}
                                            onChange={e => setDocName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Nb pages"
                                            value={docPages}
                                            onChange={e => setDocPages(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                            min="1"
                                        />
                                        <input 
                                            type="file" 
                                            accept="application/pdf"
                                            onChange={e => setDocFile(e.target.files ? e.target.files[0] : null)}
                                            className="w-full text-sm col-span-2"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md disabled:opacity-50 transition"
                                >
                                    {isSubmitting ? 'Création en cours...' : 'Créer le cours'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
            {/* Section Cours */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
                            Catalogue des Cours
                        </h1>
                        <p className="text-lg text-gray-500">Explorez nos ressources pédagogiques</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                        {courses.length} cours disponibles
                    </div>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Aucun cours trouvé</h3>
                        <p className="mt-1 text-gray-500">Revenez plus tard pour voir les nouveaux contenus.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </section>

            {/* Section Vidéos */}
            <section>
                <div className="flex justify-between items-end mb-8 border-t pt-12 border-gray-200">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
                            Catalogue des Vidéos
                        </h2>
                        <p className="text-lg text-gray-500">Vidéos complémentaires et tutoriels</p>
                    </div>
                    <div className="bg-red-100 text-red-800 text-sm font-semibold px-4 py-1.5 rounded-full">
                        {videos.length} vidéos disponibles
                    </div>
                </div>

                {videos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <Film className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Aucune vidéo trouvée</h3>
                        <p className="mt-1 text-gray-500">Revenez plus tard pour voir les nouvelles vidéos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Courses;