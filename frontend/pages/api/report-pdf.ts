// frontend/pages/api/report-pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/report/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) throw new Error('Backend PDF generation failed');

    const blob = await response.arrayBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="precontract-report.docx"');
    res.send(Buffer.from(blob));
  } catch (err: any) {
    console.error('[report-pdf.ts] Error:', err);
    res.status(500).json({ error: 'PDF generation failed' });
  }
}
