# backend/routes/report_pdf.py
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from weasyprint import HTML, CSS
from supabase import create_client, Client
import os
import io

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/report-pdf")
async def generate_report_pdf(request: Request):
    project_id = request.query_params.get("id")
    if not project_id:
        raise HTTPException(status_code=400, detail="Missing project id")

    result = supabase.from_("projects").select("*").eq("id", project_id).single().execute()
    if result.error:
        raise HTTPException(status_code=404, detail="Project not found")

    project = result.data

    html_content = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; padding: 40px; color: #333; }}
            header {{ text-align: center; margin-bottom: 40px; }}
            img.logo {{ height: 80px; }}
            h1 {{ color: #2c3e50; font-size: 22px; }}
            .section {{ margin-bottom: 20px; }}
            .label {{ font-weight: bold; }}
            .footer {{ margin-top: 60px; font-size: 0.9em; color: #555; }}
        </style>
    </head>
    <body>
        <header>
            <img src="file://{os.getcwd()}/frontend/public/assets/gbta-logo.jpg" class="logo" />
            <h1>PreContract Site Risk Report</h1>
        </header>

        <div class="section">
            <p><span class="label">Project:</span> {project['project_name']}</p>
            <p><span class="label">Lot:</span> {project['lot_number']}</p>
            <p><span class="label">Council:</span> {project['council']}</p>
            <p><span class="label">Address:</span> {project['address']}</p>
            <p><span class="label">Submitted:</span> {project['submitted_at']}</p>
        </div>

        <div class="section">
            <p><span class="label">Latitude:</span> {project['lat']}</p>
            <p><span class="label">Longitude:</span> {project['lng']}</p>
            <p><span class="label">Elevation:</span> {project['elevation'] or 'N/A'} m</p>
            <p><span class="label">Distance to Coast:</span> {project['coastal_distance'] or 'N/A'} km</p>
        </div>

        <div class="section">
            <p><span class="label">Services Requested:</span> {project['services']}</p>
        </div>

        <div class="section">
            <p><span class="label">Risk Score:</span> {project['risk_score']}/100</p>
            <p><span class="label">Risk Category:</span> {project['risk_category']}</p>
        </div>

        <div class="footer">
            <p>Prepared by:</p>
            <p><strong>Dennis McMahon</strong><br>
            CEO, Global Buildtech Australia Pty Ltd<br>
            dennis.mcmahon@global-buildtech.com<br>
            www.global-buildtech.com</p>
        </div>
    </body>
    </html>
    """

    pdf_io = io.BytesIO()
    HTML(string=html_content).write_pdf(pdf_io)
    pdf_io.seek(0)

    return StreamingResponse(pdf_io, media_type="application/pdf", headers={
        "Content-Disposition": f"inline; filename=site_report_{project_id}.pdf"
    })
