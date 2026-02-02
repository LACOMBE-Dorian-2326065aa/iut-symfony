import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import api from '../api/axios';
import type { Course } from '../types';

const CourseDetail = () => {
    const { id } = useParams<{ id: string }>(); 
    const [course, setCourse] = useState<Course | null>(null);

    useEffect(() => {
        if (!id) return;
        
        api.get<Course>(`/api/courses/${id}`)
           .then(res => setCourse(res.data))
           .catch(console.error);
    }, [id]);

    if (!course) return <div className="p-4">Chargement...</div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            
            {course.videoUrl && (
                <div className="bg-black aspect-video rounded-lg overflow-hidden shadow-lg">
                    {/* @ts-ignore: ReactPlayer types mismatch */}
                    <ReactPlayer url={course.videoUrl} width="100%" height="100%" controls />
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Description</h2>
                <p className="text-gray-700">{course.description}</p>
            </div>

            {course.pdfUrl && (
                <div className="h-96 border rounded-lg overflow-hidden shadow">
                   <iframe src={course.pdfUrl} className="w-full h-full" title="Support PDF" />
                </div>
            )}

            <div className="flex justify-center pt-6">
                <Link 
                    to={`/quiz/${course.id}`} 
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-700 shadow-lg transform hover:scale-105 transition"
                >
                    📝 Passer le QCM
                </Link>
            </div>
        </div>
    );
};

export default CourseDetail;