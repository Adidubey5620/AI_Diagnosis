from fastapi import APIRouter
from app.models.schemas import ReportRequest
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os
from datetime import datetime

router = APIRouter()

@router.post("/generate-report")
async def generate_report(request: ReportRequest):
    # Ensure reports directory exists
    reports_dir = "reports"
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
        
    filename = f"report_{request.image_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    file_path = os.path.join(reports_dir, filename)
    
    doc = SimpleDocTemplate(file_path, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Header
    title_style = styles["Title"]
    story.append(Paragraph("Medical Imaging & AI Analysis Report", title_style))
    story.append(Spacer(1, 12))
    
    # Patient Info & Demographics
    data = [
        ["Patient Name:", request.patient_name, "Report Date:", datetime.now().strftime("%Y-%m-%d")],
        ["Referring Physician:", request.doctor_name, "Report ID:", request.image_id],
        ["Clinical Indication:", request.clinical_indication or "N/A", "", ""]
    ]
    
    table = Table(data, colWidths=[1.5*inch, 2.5*inch, 1.2*inch, 1.8*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.aliceblue),
        ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ]))
    story.append(table)
    story.append(Spacer(1, 20))
    
    # Primary Diagnosis Headers
    story.append(Paragraph(f"Primary Diagnosis: <font color='blue'>{request.diagnosis}</font>", styles["Heading2"]))
    story.append(Paragraph(f"Confidence Score: {request.confidence * 100:.1f}%", styles["Normal"]))
    story.append(Spacer(1, 12))
    
    # Findings
    story.append(Paragraph("Key Findings:", styles["Heading3"]))
    bullet_style = ParagraphStyle("Bullet", parent=styles["Normal"], bulletIndent=10)
    for finding in request.findings:
        story.append(Paragraph(f"• {finding}", bullet_style))
    story.append(Spacer(1, 12))
    
    # Recommendations
    story.append(Paragraph("Recommendations:", styles["Heading3"]))
    for rec in request.recommendations:
        story.append(Paragraph(f"• {rec}", bullet_style))
    story.append(Spacer(1, 12))
    
    # Medical Explanation
    story.append(Paragraph("Detailed Explanation:", styles["Heading3"]))
    story.append(Paragraph(request.medical_explanation, styles["Normal"]))
    story.append(Spacer(1, 20))
    
    # Signature
    story.append(Spacer(1, 30))
    story.append(Paragraph("_" * 40, styles["Normal"]))
    story.append(Paragraph("Electronically Signed by AI Assistant (Verified by Physician)", styles["Normal"]))
    
    doc.build(story)
    
    return {"image_id": request.image_id, "report_url": f"/reports/{filename}"}
