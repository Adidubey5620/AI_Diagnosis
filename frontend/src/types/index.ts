export interface DiagnosisResult {
    image_id: string;
    diagnosis: string;
    confidence: number;
    details: Record<string, any>;
}
