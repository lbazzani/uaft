import { NextRequest, NextResponse } from 'next/server';
import { getSmtpClient } from '@/lib/mail/smtp-client';

export async function POST(req: NextRequest) {
  try {
    // Parse JSON con gestione errori
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { from, to, cc, bcc, subject, text, html, userId } = body;

    // Validazione base
    if (!from || !to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, subject' },
        { status: 400 }
      );
    }

    // Ottieni client SMTP
    const smtpClient = getSmtpClient();

    // Invia email
    const result = await smtpClient.sendEmail({
      from,
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      userId,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'Email sent successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API /mail/send error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
