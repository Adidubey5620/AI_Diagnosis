import React, { useState } from 'react';
import { X, FileText, Download, Loader } from 'lucide-react';
import { generateReport } from '../services/api';

interface ReportGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    diagnosisDetails: any; // Full diagnosis object
    imageId: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ isOpen, onClose, diagnosisDetails, imageId }) => {
    const [patientName, setPatientName] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [indication, setIndication] = useState('');
    const [loading, setLoading] = useState(false);
    const [reportUrl, setReportUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setReportUrl(null);

        try {
            const reportData = {
                image_id: imageId,
                patient_name: patientName || 'Anonymous',
                doctor_name: doctorName || 'Dr. AI',
                clinical_indication: indication,
                diagnosis: diagnosisDetails.diagnosis,
                confidence: diagnosisDetails.confidence,
                findings: diagnosisDetails.details.findings?.map((f: any) => typeof f === 'string' ? f : f.description) || [],
                recommendations: diagnosisDetails.details.recommendations || [],
                medical_explanation: diagnosisDetails.details.medical_explanation || ''
            };

            const result = await generateReport(reportData);
            if (result.report_url) {
                setReportUrl(`http://localhost:8000${result.report_url}`);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate report. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Generate Medical Report
                    </h2>
                    <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!reportUrl ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name / ID</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="e.g. John Doe / P-12345"
                                    value={patientName}
                                    onChange={e => setPatientName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Referring Physician</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="e.g. Dr. Sarah Smith"
                                    value={doctorName}
                                    onChange={e => setDoctorName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Indication</label>
                                <textarea
                                    className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
                                    placeholder="Reason for examination..."
                                    value={indication}
                                    onChange={e => setIndication(e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Generate PDF'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Download className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Report Ready!</h3>
                            <p className="text-gray-500 mb-6">The medical report has been successfully generated.</p>

                            <a
                                href={reportUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all"
                            >
                                <Download className="w-5 h-5" /> Download PDF
                            </a>

                            <button
                                onClick={() => setReportUrl(null)}
                                className="block w-full mt-4 text-blue-600 hover:underline text-sm"
                            >
                                Generate Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportGenerator;
