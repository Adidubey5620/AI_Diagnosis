import React, { useState } from 'react';
import { useMedicalContext } from '../context/MedicalContext';
import ImageUploader from '../components/ImageUploader';
import ImageViewer from '../components/ImageViewer';
import DiagnosisPanel from '../components/DiagnosisPanel';
import ReportGenerator from '../components/ReportGenerator';
import { getDiagnosis } from '../services/api';
import { Activity, LayoutDashboard, LogOut, User, PlusCircle, Globe, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MedicalDashboard: React.FC = () => {
    const { t, i18n } = useTranslation();
    const {
        currentImage,
        analysisResults,
        isAnalyzing,
        setCurrentImage,
        setAnalysisResults,
        setIsAnalyzing,
        resetDashboard
    } = useMedicalContext();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleImageUpload = async (imageId: string) => {
        setIsAnalyzing(true);
        setUploadError(null);

        try {
            // ImageUploader has already uploaded the file. 
            // We now fetch the analysis results using the returned imageId.
            const diagnosisRes = await getDiagnosis(imageId);
            setAnalysisResults(diagnosisRes);
            // Set the image URL from the response for the Viewer
            if (diagnosisRes.details && diagnosisRes.details.image_url) {
                setCurrentImage(diagnosisRes.details.image_url);
            }

        } catch (err) {
            console.error(err);
            setUploadError("Analysis failed. Please try again.");
            setAnalysisResults(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const [highContrast, setHighContrast] = useState(false);

    return (
        <div className={`min-h-screen flex flex-col h-screen overflow-hidden ${highContrast ? 'grayscale contrast-125 bg-white' : 'bg-slate-50'}`}>
            {/* Header */}
            <header className={`${highContrast ? 'bg-black border-white text-white' : 'bg-white border-gray-200'} border-b shrink-0 shadow-sm z-30`}>
                <div className="px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-lg ${highContrast ? 'bg-white text-black' : 'bg-blue-600 text-white shadow-blue-200'}`}>
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('app_title')}</h1>
                            <p className="text-xs text-gray-500 font-medium">{t('subtitle')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setHighContrast(!highContrast)}
                            className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                            aria-label={highContrast ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
                            title={highContrast ? "Disable High Contrast" : "Enable High Contrast"}
                        >
                            {highContrast ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>

                        <div className="relative group">
                            <button className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors" aria-label="Select Language">
                                <Globe className="w-5 h-5" />
                            </button>
                            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block z-50">
                                <button onClick={() => i18n.changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">English</button>
                                <button onClick={() => i18n.changeLanguage('es')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">Español</button>
                                <button onClick={() => i18n.changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">Français</button>
                            </div>
                        </div>

                        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 border border-gray-200">
                            <User className="w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder={t('patient_id')}
                                className="bg-transparent border-none focus:ring-0 text-sm w-32 text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <button className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Panel: Image Viewer / Upload */}
                <div className="flex-1 bg-slate-100 relative flex flex-col border-r border-gray-200">
                    {/* Toolbar / Breadcrumbs */}
                    <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>{t('dashboard_breadcrumb')}</span>
                            <span>/</span>
                            <span className="font-medium text-gray-900">{analysisResults ? t('analysis_complete') : t('new_scan')}</span>
                        </div>
                        {analysisResults && (
                            <button
                                onClick={resetDashboard}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <PlusCircle className="w-4 h-4" /> {t('new_scan')}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4">
                        {!currentImage ? (
                            <div className="w-full max-w-xl">
                                <ImageUploader onUploadComplete={handleImageUpload} />
                                {isAnalyzing && (
                                    <div className="mt-8 text-center animate-pulse">
                                        <div className="text-blue-600 font-medium text-lg mb-2">Analyzing Medical Image...</div>
                                        <p className="text-gray-500">Running differential diagnosis algorithms</p>
                                    </div>
                                )}
                                {uploadError && (
                                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-center">
                                        {uploadError}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                                {isAnalyzing && (
                                    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col">
                                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                                        <h3 className="text-xl font-bold text-gray-800">Processing Scan</h3>
                                        <p className="text-gray-500">Detecting abnormalities...</p>
                                    </div>
                                )}
                                <ImageViewer
                                    imageUrl={currentImage}
                                    annotations={analysisResults?.details.annotations || []}
                                    onAnnotationClick={(ann) => alert(`${ann.label}: ${ann.explanation}`)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Diagnosis & Results */}
                <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col z-20 shadow-xl">
                    {analysisResults ? (
                        <DiagnosisPanel
                            diagnosis={analysisResults}
                            loading={isAnalyzing}
                            onGenerateReport={() => setIsReportModalOpen(true)}
                            onFindingClick={(finding) => console.log(finding)}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Activity className="w-10 h-10 opacity-20" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis</h3>
                            <p className="max-w-[240px]">Upload a medical scan to receive AI-powered diagnostic insights.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {analysisResults && (
                <ReportGenerator
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    diagnosisDetails={analysisResults}
                    imageId={analysisResults.image_id}
                />
            )}

            {/* Medical Disclaimer Banner */}
            <div className="bg-amber-500 text-white p-2 text-center text-xs font-semibold fixed bottom-0 w-full z-50">
                ⚠️ DISCLAIMER: This tool is for educational and assistive purposes only. All diagnoses must be verified by licensed medical professionals. Not a substitute for professional medical advice.
            </div>
        </div>
    );
};

export default MedicalDashboard;
