import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
    en: {
        translation: {
            "app_title": "AI Diagnosis Assistant",
            "subtitle": "Professional Medical Imaging Suite",
            "upload_title": "Upload Medical Scans",
            "upload_desc": "Drag & drop DICOM, JPG, PNG files here",
            "analyzing": "Analyzing Medical Image...",
            "emergency_title": "Medical Emergency",
            "emergency_desc": "Condition requires immediate attention. Protocol initiated.",
            "call_911": "Call 911",
            "find_er": "Find ER",
            "findings": "Analysis Findings",
            "diagnosis": "Differential Diagnosis",
            "recommendations": "Recommendations",
            "generate_report": "Generate Full Report",
            "medical_terms": "Medical Terms",
            "plain_language": "Plain Language",
            "patient_id": "Patient ID",
            "new_scan": "New Scan",
            "dashboard_breadcrumb": "Dashboard",
            "analysis_complete": "Analysis Complete"
        }
    },
    es: {
        translation: {
            "app_title": "Asistente de Diagnóstico IA",
            "subtitle": "Suite de Imágenes Médicas Profesional",
            "upload_title": "Subir Escáneres Médicos",
            "upload_desc": "Arrastra y suelta archivos DICOM, JPG, PNG aquí",
            "analyzing": "Analizando Imagen Médica...",
            "emergency_title": "Emergencia Médica",
            "emergency_desc": "La condición requiere atención inmediata. Protocolo iniciado.",
            "call_911": "Llamar al 911",
            "find_er": "Buscar Urgencias",
            "findings": "Hallazgos del Análisis",
            "diagnosis": "Diagnóstico Diferencial",
            "recommendations": "Recomendaciones",
            "generate_report": "Generar Informe Completo",
            "medical_terms": "Términos Médicos",
            "plain_language": "Lenguaje Sencillo",
            "patient_id": "ID del Paciente",
            "new_scan": "Nuevo Escáner",
            "dashboard_breadcrumb": "Tablero",
            "analysis_complete": "Análisis Completo"
        }
    },
    fr: {
        translation: {
            "app_title": "Assistant Diagnostic IA",
            "subtitle": "Suite d'Imagerie Médicale Professionnelle",
            "upload_title": "Télécharger des Scanners Médicaux",
            "upload_desc": "Glissez-déposez des fichiers DICOM, JPG, PNG ici",
            "analyzing": "Analyse de l'Image Médicale...",
            "emergency_title": "Urgence Médicale",
            "emergency_desc": "L'état nécessite une attention immédiate. Protocole lancé.",
            "call_911": "Appeler le 911",
            "find_er": "Trouver les Urgences",
            "findings": "Résultats de l'Analyse",
            "diagnosis": "Diagnostic Différentiel",
            "recommendations": "Recommandations",
            "generate_report": "Générer un Rapport Complet",
            "medical_terms": "Termes Médicaux",
            "plain_language": "Langage Simple",
            "patient_id": "ID Patient",
            "new_scan": "Nouveau Scan",
            "dashboard_breadcrumb": "Tableau de Bord",
            "analysis_complete": "Analyse Terminée"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
