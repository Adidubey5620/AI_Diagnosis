import React from 'react';
import { AlertTriangle, Info, CheckCircle, AlertOctagon } from 'lucide-react';

interface Finding {
    description: string; // or structured finding if any
    location?: string;
}

interface FindingsListProps {
    findings: string[] | Finding[]; // Handle both strings and objects
    severity: string;
}

const FindingsList: React.FC<FindingsListProps> = ({ findings, severity }) => {
    const getSeverityColor = (sev: string) => {
        switch (sev?.toUpperCase()) {
            case 'URGENT': return 'bg-red-50 text-red-700 border-red-200';
            case 'MODERATE': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'ROUTINE': return 'bg-green-50 text-green-700 border-green-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getSeverityIcon = (sev: string) => {
        switch (sev?.toUpperCase()) {
            case 'URGENT': return <AlertOctagon className="w-5 h-5 text-red-600" />;
            case 'MODERATE': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'ROUTINE': return <CheckCircle className="w-5 h-5 text-green-600" />;
            default: return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    return (
        <div className={`rounded-xl border p-6 ${getSeverityColor(severity)}`}>
            <div className="flex items-center gap-3 mb-4">
                {getSeverityIcon(severity)}
                <h3 className="text-lg font-bold uppercase tracking-wide">
                    {severity || "Analysis"} Findings
                </h3>
            </div>

            <ul className="space-y-3">
                {findings.map((finding, index) => (
                    <li key={index} className="flex gap-3 items-start">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <span className="text-sm font-medium leading-relaxed">
                            {typeof finding === 'string' ? finding : `${finding.description} (${finding.location || 'Unknown location'})`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FindingsList;
