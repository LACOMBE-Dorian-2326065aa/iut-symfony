import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Course, Video, ApiResponse } from '../types';
import { Link } from 'react-router-dom';
import { BookOpen, Video as Play, Clock, Film } from 'lucide-react';

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
    const [courses, setCourses] = useState<Course[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
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