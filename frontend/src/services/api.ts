import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getDiagnosis = async (imageId: string) => {
    const response = await axios.get(`${API_URL}/diagnosis/${imageId}`);
    return response.data;
};

export const analyzeImage = async (imageId: string) => {
    const response = await axios.post(`${API_URL}/analyze-image`, { image_id: imageId });
    return response.data;
};

export const generateReport = async (data: {
    image_id: string;
    patient_name: string;
    doctor_name: string;
    clinical_indication: string;
    diagnosis: string;
    confidence: number;
    findings: string[];
    recommendations: string[];
    medical_explanation: string;
}) => {
    const response = await axios.post(`${API_URL}/generate-report`, data);
    return response.data;
};
