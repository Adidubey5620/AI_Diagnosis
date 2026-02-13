import React from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';

const UploadPage: React.FC = () => {
    const navigate = useNavigate();

    const handleUploadComplete = (imageId: string) => {
        navigate(`/results/${imageId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Medical Scan</h1>
                <p className="text-gray-600">
                    Securely upload your X-Ray, MRI, or CT scan for instant AI analysis.
                </p>
            </div>

            <ImageUploader onUploadComplete={handleUploadComplete} />

            <div className="max-w-2xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-gray-500">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">HIPAA Compliant</p>
                    <p>Data is processed securely and anonymous.</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">Instant Analysis</p>
                    <p>Get results in seconds with Gemini AI.</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-gray-900 mb-1">Expert Review</p>
                    <p>Designed to assist medical professionals.</p>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
