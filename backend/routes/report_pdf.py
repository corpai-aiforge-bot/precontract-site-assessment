# backend/routes/report_pdf.py
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from datetime import datetime
from io import BytesIO
from weasyprint import HTML

router = APIRouter()

@router.post("/report/pdf")
async def generate_pdf(request: Request):
    data = await request.json()

    html_content = f"""
    <html>
    <head>
      <style>
        body {{ font-family: sans-serif; padding: 40px; }}
        h1 {{ font-size: 24px; }}
        h2 {{ font-size: 20px; margin-top: 30px; }}
        p {{ margin: 4px 0; }}
      </style>
    </head>
    <body>
      <h1>PreContract Site Assessment Report</h1>
      <p><strong>Generated on:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>

      <h2>Project Info</h2>
      <p><strong>Project Name:</strong> {data.get('projectName')}</p>
      <p><strong>Client:</strong> {data.get('firstName')} {data.get('lastName')}</p>
      <p><strong>Address:</strong> {data.get('street')}, {data.get('suburb')} {data.get('state')} {data.get('postcode')}</p>

      <h2>Geospatial Metadata</h2>
      <p><strong>Council:</strong> {data.get('council')}</p>
      <p><strong>Elevation:</strong> {data.get('elevation')} m</p>
      <p><strong>Distance to Coast:</strong> {data.get('distanceToCoast')} km</p>
      <p><strong>Wind Zone:</strong> {data.get('windZone')}</p>
      <p><strong>BAL Rating:</strong> {data.get('balRating')}</p>
      <p><strong>Benchmarks:</strong> {data.get('benchmark1')}, {data.get('benchmark2')}</p>

      <h2>Assessment</h2>
      <p><strong>Footing Recommendation:</strong> {data.get('footingRecommendation')}</p>
      <p><strong>Risk Summary:</strong> {data.get('riskSummary')}</p>
      <p><strong>Services Requested:</strong> {', '.join(data.get('services', []))}</p>
    </body>
    </html>
    """

    pdf_io = BytesIO()
    HTML(string=html_content).write_pdf(pdf_io)
    pdf_io.seek(0)

    headers = {
        "Content-Disposition": "inline; filename=precontract-site-report.pdf"
    }
    return StreamingResponse(pdf_io, media_type="application/pdf", headers=headers)
