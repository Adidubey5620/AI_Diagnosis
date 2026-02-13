import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDiagnosis, analyzeImage } from '../services/api';
import { ArrowLeft, Share2 } from 'lucide-react';
import DiagnosisPanel from '../components/DiagnosisPanel';
import ImageViewer from '../components/ImageViewer';
import ReportGenerator from '../components/ReportGenerator';

const ResultsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [diagnosis, setDiagnosis] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getDiagnosis(id)
                .then(data => {
                    setDiagnosis(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log("Diagnosis not found, triggering analysis..."); // Debug log
                    analyzeImage(id)
                        .then(data => {
                            setDiagnosis(data);
                            setLoading(false);
                        })
                        .catch(analyzeErr => {
                            console.error("Analysis error:", analyzeErr);
                            setError(analyzeErr.response?.data?.detail || "Analysis failed. Please try again.");
                            setLoading(false);
                        });
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !diagnosis) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-red-600 mb-4">{error || "No diagnosis found."}</div>
                <Link to="/upload" className="text-blue-600 hover:underline">
                    Return to Upload
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 shrink-0">
                <div className="px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/upload" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-lg font-bold text-white">Analysis Results</h1>
                        <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">{id}</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-gray-300 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 text-xs font-medium">
                            <Share2 className="w-3.5 h-3.5" /> Share
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Image Viewer (Flexible) */}
                <div className="flex-1 bg-black relative flex flex-col">
                    <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                        {diagnosis.details ? (
                            <ImageViewer
                                imageUrl={diagnosis.details.image_url || "https://placehold.co/1200x900?text=Scan+Image"}
                                annotations={diagnosis.details.annotations || []}
                                onAnnotationClick={(ann) => alert(`Annotation: ${ann.label}\n${ann.explanation || 'No details'}`)}
                            // We can pass a prop to highlight specific finding from panel later
                            />
                        ) : (
                            <div className="text-gray-500">Loading Image...</div>
                        )}
                    </div>
                </div>

                {/* Right: Diagnosis Panel (Fixed Width) */}
                <DiagnosisPanel
                    diagnosis={diagnosis}
                    loading={loading}
                    onGenerateReport={() => setIsReportModalOpen(true)}
                    onFindingClick={(finding) => {
                        console.log("Finding clicked:", finding);
                        // Future: Trigger Highlight in ImageViewer
                    }}
                />

                <ReportGenerator
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    diagnosisDetails={diagnosis}
                    imageId={id!}
                />

            </div>
        </div>
    );
};

export default ResultsPage;
