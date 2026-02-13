import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface DiagnosisData {
    image_id: string;
    diagnosis: string;
    confidence: number;
    details: {
        findings: string[] | { description: string }[];
        differential_diagnosis: { condition: string; probability: string }[];
        recommendations: string[];
        medical_explanation: string;
        patient_explanation: string;
        image_url: string;
        annotations: any[];
        severity: string;
    };
}

interface MedicalContextType {
    currentImage: string | null;
    analysisResults: DiagnosisData | null;
    isAnalyzing: boolean;
    setCurrentImage: (url: string | null) => void;
    setAnalysisResults: (data: DiagnosisData | null) => void;
    setIsAnalyzing: (status: boolean) => void;
    resetDashboard: () => void;
}

const MedicalContext = createContext<MedicalContextType | undefined>(undefined);

export const MedicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [analysisResults, setAnalysisResults] = useState<DiagnosisData | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const resetDashboard = () => {
        setCurrentImage(null);
        setAnalysisResults(null);
        setIsAnalyzing(false);
    };

    return (
        <MedicalContext.Provider value={{
            currentImage,
            analysisResults,
            isAnalyzing,
            setCurrentImage,
            setAnalysisResults,
            setIsAnalyzing,
            resetDashboard
        }}>
            {children}
        </MedicalContext.Provider>
    );
};

export const useMedicalContext = () => {
    const context = useContext(MedicalContext);
    if (context === undefined) {
        throw new Error('useMedicalContext must be used within a MedicalProvider');
    }
    return context;
};
