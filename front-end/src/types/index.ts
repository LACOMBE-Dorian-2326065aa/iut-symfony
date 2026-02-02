export interface User {
    id?: number;
    email: string;
    firstname?: string;
    lastname?: string;
    roles: string[];
    token?: string;
}

export interface Course {
    id: number;
    name: string;
}

export interface DetailedCourse {
    id: number;
    name: string;
    videos: ApiResponse<Video>;
    documents: ApiResponse<Document>;
}

export interface HydraResponse<T> {
    'hydra:member': T[];
    'hydra:totalItems'?: number;
}

export interface ApiResponse<T> {
    items: T[];
}

export interface Video {
    id: number;
    name: string;
    duration: number;
    path: string;
}

export interface PublicUser {
    id: number;
    email: string;
    firstname?: string;
    lastname?: string;
}

export interface Document {
    id: number;
    name: string;
    numberOfPages: number;
    user: PublicUser;
    path: string;
}

export interface Quizz {
    id: number;
    name: string;
    course: Course;
}

export interface QuizzAttempt {
    id: number;
    quizz: Quizz;
    user: PublicUser;
    note: number;
    date: {
        date: string;
    };
}