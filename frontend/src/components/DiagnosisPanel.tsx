import React, { useState } from 'react';
import {
    AlertOctagon, Info, ChevronDown, ChevronUp,
    Beaker, UserPlus, Pill, Ambulance, FileText, Download, HelpCircle
} from 'lucide-react';

interface DiagnosisPanelProps {
    diagnosis: any;
    loading: boolean;
    onGenerateReport: () => void;
    onFindingClick: (finding: string) => void;
}

const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ diagnosis, loading, onGenerateReport, onFindingClick }) => {
    const [viewMode, setViewMode] = useState<'medical' | 'patient'>('medical');
    const [expandedSection, setExpandedSection] = useState<string | null>('diagnosis');

    if (loading) {
        return (
            <div className="w-[400px] h-full bg-white border-l border-gray-200 p-6 flex flex-col gap-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
        );
    }

    if (!diagnosis || !diagnosis.details) return null;

    const { details } = diagnosis;

    const getProgressBarColor = (score: number) => {
        if (score > 0.7) return 'bg-red-500';
        if (score > 0.4) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    // Helper for Recommendation Icon
    const getRecommendationIcon = (type: string) => {
        const t = type.toLowerCase();
        if (t.includes('urgent') || t.includes('emergency')) return <Ambulance className="w-4 h-4 text-red-500" />;
        if (t.includes('consult') || t.includes('referral')) return <UserPlus className="w-4 h-4 text-blue-500" />;
        if (t.includes('treatment') || t.includes('medication')) return <Pill className="w-4 h-4 text-green-500" />;
        return <Beaker className="w-4 h-4 text-purple-500" />; // Default to test/other
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden shadow-xl z-20">
            {/* Header / Mode Toggle */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <button
                    onClick={() => setViewMode('medical')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'medical' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Medical Terms
                </button>
                <button
                    onClick={() => setViewMode('patient')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'patient' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                    Plain Language
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Emergency Protocol Banner */}
                {(details.severity === 'urgent' || details.severity === 'critical') && (
                    <div className="bg-red-600 text-white p-4 mx-4 mt-4 rounded-xl shadow-lg border-2 border-red-400 animate-pulse">
                        <div className="flex items-start gap-3">
                            <AlertOctagon className="w-8 h-8 shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg uppercase tracking-wider">Medical Emergency</h3>
                                <p className="text-red-100 text-sm mt-1">
                                    Condition requires immediate attention. Protocol initiated.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <button className="bg-white text-red-600 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                <Ambulance className="w-4 h-4" /> Call 911
                            </button>
                            <button className="bg-red-800 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-900 transition-colors border border-red-700">
                                Find ER
                            </button>
                        </div>
                    </div>
                )}

                {/* SECTION 1: Findings Summary */}
                <div className={`p-4 rounded-xl border ${diagnosis.confidence > 0.7 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-2 mb-3">
                        {diagnosis.confidence > 0.7 ? <AlertOctagon className="w-5 h-5 text-red-600" /> : <Info className="w-5 h-5 text-blue-600" />}
                        <h2 className="font-bold text-gray-900 uppercase tracking-wide text-sm">
                            {viewMode === 'medical' ? 'Analysis Findings' : 'Summary'}
                        </h2>
                    </div>

                    <ul className="space-y-2">
                        {details.findings?.map((finding: string | { description: string }, i: number) => {
                            const text = typeof finding === 'string' ? finding : finding.description;
                            return (
                                <li
                                    key={i}
                                    className="text-sm text-gray-800 flex items-start gap-2 cursor-pointer hover:bg-white/50 p-1 rounded transition-colors"
                                    onClick={() => onFindingClick(text)}
                                >
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
                                    <span>{text}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* SECTION 2: Differential Diagnosis */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSection('diagnosis')}
                    >
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            Differential Diagnosis
                        </h3>
                        {expandedSection === 'diagnosis' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedSection === 'diagnosis' && (
                        <div className="p-4 space-y-4 bg-white">
                            {details.differential_diagnosis?.map((item: any, i: number) => {
                                const prob = parseFloat(item.probability.replace('%', ''));
                                return (
                                    <div key={i} className="group">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-900">{item.condition}</span>
                                            <span className="text-gray-500">{item.probability}</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                                            <div
                                                className={`h-full rounded-full ${getProgressBarColor(prob / 100)}`}
                                                style={{ width: item.probability }}
                                            />
                                        </div>
                                        <div className="hidden group-hover:flex gap-2 mt-1">
                                            <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                <HelpCircle className="w-3 h-3" /> Why?
                                            </button>
                                            <button className="text-xs text-green-600 hover:underline flex items-center gap-1">
                                                <UserPlus className="w-3 h-3" /> Explain to Patient
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* SECTION 3: Recommendations */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleSection('recommendations')}
                    >
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Pill className="w-4 h-4 text-gray-500" />
                            Recommendations
                        </h3>
                        {expandedSection === 'recommendations' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {expandedSection === 'recommendations' && (
                        <div className="p-4 bg-white space-y-3">
                            {details.recommendations?.map((rec: string, i: number) => (
                                <div key={i} className="flex gap-3 text-sm text-gray-700 items-start p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-100">
                                    <div className="mt-0.5 shrink-0">
                                        {getRecommendationIcon(rec)}
                                    </div>
                                    <span>{rec}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SECTION 4: Patient Education */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Patient Explanation
                    </h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                        {viewMode === 'medical' ? details.medical_explanation : details.patient_explanation}
                    </p>
                </div>

            </div>

            {/* Footer / Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                    onClick={onGenerateReport}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    <Download className="w-5 h-5" />
                    Generate Full Report
                </button>
            </div>
        </div>
    );
};

export default DiagnosisPanel;
