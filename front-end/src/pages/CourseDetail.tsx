import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import type { DetailedCourse, Video, Document } from '../types';
import { BookOpen, Video as VideoIcon, FileText, Play, Clock, File, User as UserIcon } from 'lucide-react';

const VideoCard = ({ video }: { video: Video }) => (
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
                    href={video.path} 
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

const DocumentCard = ({ document }: { document: Document }) => {
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
            </div>
        </div>
    </div>
    );
};

const CourseDetail = () => {
    const { id } = useParams<{ id: string }>(); 
    const [course, setCourse] = useState<DetailedCourse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        
        const fetchCourse = async () => {
             try {
                const res = await api.get<DetailedCourse>(`/api/course/${id}`);
                setCourse(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!course) return <div className="p-4 text-center">Cours introuvable</div>;

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
        
            {/* Section Vidéos */}
            <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <VideoIcon className="text-red-500" /> Vidéos du cours
                </h2>
                {course.videos.items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {course.videos.items.map(video => (
                            <VideoCard key={video.id} video={video} />
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
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Aucun document associé à ce cours.</p>
                )}
            </section>

             <div className="flex justify-center pt-6 border-t">
                <Link 
                    to={`/quiz/${course.id}`} 
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-700 shadow-lg transform hover:scale-105 transition flex items-center gap-2"
                >
                    📝 Passer le QCM
                </Link>
            </div>
        </div>
    );
};

export default CourseDetail;