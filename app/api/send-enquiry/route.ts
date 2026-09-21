import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgtype, course, company, contact, title, headcount, duration, language, mode, location, contactinfo, note } = body;

    // SMTP 設定
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });

    const mailHtml = `
    <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; background:#f8f9fa; padding:30px 0;">
      <div style="max-width:680px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 2px 12px #0000000c;">
        
        <!-- 頂部主色 Header -->
        <div style="background:#142455; padding:24px 30px;">
          <h2 style="margin:0; color:#fff; font-size:20px; font-weight:600;">${company || '未知機構'} - 企業培訓查詢</h2>
          <p style="margin:6px 0 0; color:#e0f2fe; font-size:14px;">NITTP 認可培訓機構｜網站查詢記錄</p>
        </div>

        <div style="padding:24px 30px 30px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tbody>
              <tr>
                <td width="32%" style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">機構類型</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${orgtype}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">培訓需求</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${course}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">公司名稱</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${company}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">稱呼</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${contact}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">預計人數</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${headcount}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">時長要求</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${duration}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">上課模式</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${mode}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">自定上課地區</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${location}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">聯絡資料</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555;">${contactinfo}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background:#f7f8fa; border:1px solid #eee; color:#333; font-weight:500;">備註內容</td>
                <td style="padding:12px 16px; border:1px solid #eee; color:#555; white-space:pre-line;">${note}</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top:28px; padding-top:20px; border-top:1px solid #eee; font-size:13px; color:#999;">
            此郵件由網站自動發送｜查詢將於 1 個工作天內回覆
          </div>
        </div>

      </div>
    </div>
    `;

    await transporter.sendMail({
    from: '"ITE 企業培訓查詢" <' + process.env.SMTP_USER + '>',
    to: process.env.MAIL_TO,
    subject: `【網站查詢】${company} - 索取企業培訓方案`,
    html: mailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
