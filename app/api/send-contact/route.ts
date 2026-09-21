import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, services, contactType, details } = body;

    const MAIL_TO = process.env.MAIL_TO?.trim();
    const SMTP_USER = process.env.SMTP_USER;

    if (!MAIL_TO) {
      return NextResponse.json({ success: false, error: '收件人未設定' }, { status: 400 });
    }

    const empty = '未填寫';
    const serviceText = services?.length ? services.join('、') : empty;

    const mailHtml = `
    <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background:#f8f9fa; padding:30px 0;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px #0000000c;">
        
        <div style="background:#0e7490; padding:24px 30px;">
          <h2 style="margin:0; color:#fff; font-size:20px; font-weight:600;">聯絡表單查詢</h2>
          <p style="margin:6px 0 0; color:#e0f2fe; font-size:14px;">ITE InnoTrendEDU｜新網站聯絡記錄</p>
        </div>

        <div style="padding:24px 30px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tbody>
              <tr>
                <td width="32%" style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">稱呼</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${name || empty}</td>
              </tr>
              <tr>
              <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">電話</td>
              <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${phone || empty}</td>
              </tr>
              <tr>
              <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">電郵</td>
              <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${email || empty}</td>
              </tr>
              <tr>
              <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">感興趣服務</td>
              <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${serviceText}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">聯絡類型</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${contactType || empty}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">詳細內容</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555; white-space:pre-line;">${details || empty}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top:28px; padding-top:20px; border-top:1px solid #eee; font-size:13px; color:#999;">
            此郵件由網站聯絡表單自動發送｜查詢將於 1 個工作天內回覆
          </div>
        </div>

      </div>
    </div>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ITE 聯絡表單" <${SMTP_USER}>`,
      to: MAIL_TO,
      subject: `【聯絡查詢】${name}｜${contactType || '一般查詢'}`,
      html: mailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SEND CONTACT MAIL ERROR:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
