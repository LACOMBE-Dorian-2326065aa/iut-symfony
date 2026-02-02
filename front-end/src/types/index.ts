export interface User {
    email: string;
    roles: string[];
    token: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    videoUrl?: string; 
    pdfUrl?: string;   
    professor?: string;
}

export interface HydraResponse<T> {
    'hydra:member': T[];
    'hydra:totalItems'?: number;
}