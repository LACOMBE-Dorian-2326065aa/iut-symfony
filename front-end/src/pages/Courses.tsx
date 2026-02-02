import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Course, HydraResponse } from '../types';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
        <h3 className="text-xl font-bold">{course.title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">{course.description}</p>
        <Link 
            to={`/courses/${course.id}`} 
            className="mt-4 inline-block text-blue-600 font-semibold hover:underline"
        >
            Voir le cours →
        </Link>
    </div>
);

const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // On type le retour de l'API
                const res = await api.get<HydraResponse<Course>>('/api/courses');
                // Gestion fallback si l'API ne renvoie pas hydra:member
                setCourses(res.data['hydra:member'] || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Liste des Cours</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default Courses;