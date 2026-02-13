import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface DiagnosisChartProps {
    data: Array<{
        condition: string;
        probability: string; // e.g. "85%"
    }>;
}

const DiagnosisChart: React.FC<DiagnosisChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.condition,
        probability: parseFloat(item.probability.replace('%', '')),
        fullProb: item.probability
    }));

    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Differential Diagnosis</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} unit="%" />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={150}
                        tick={{ fill: '#374151', fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: number | undefined) => [value != null ? `${value}%` : 'N/A', 'Probability']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={20}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.probability > 70 ? '#EF4444' : '#3B82F6'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DiagnosisChart;
