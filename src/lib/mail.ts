import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface InquiryNotification {
  name: string;
  phone: string;
  email?: string;
  region: string;
  budget?: string;
  experience?: string;
  message?: string;
}

export async function sendInquiryNotification(data: InquiryNotification) {
  if (!process.env.SMTP_USER || !process.env.NOTIFICATION_EMAIL) {
    console.log("SMTP not configured, skipping email notification");
    return;
  }

  const html = `
    <h2>새로운 가맹 상담 문의가 접수되었습니다</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">이름</td><td style="padding: 8px; border: 1px solid #ddd;">${data.name}</td></tr>
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">연락처</td><td style="padding: 8px; border: 1px solid #ddd;">${data.phone}</td></tr>
      ${data.email ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">이메일</td><td style="padding: 8px; border: 1px solid #ddd;">${data.email}</td></tr>` : ""}
      <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">희망 지역</td><td style="padding: 8px; border: 1px solid #ddd;">${data.region}</td></tr>
      ${data.budget ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">투자 예산</td><td style="padding: 8px; border: 1px solid #ddd;">${data.budget}</td></tr>` : ""}
      ${data.experience ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">교육업 경험</td><td style="padding: 8px; border: 1px solid #ddd;">${data.experience}</td></tr>` : ""}
      ${data.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">문의 내용</td><td style="padding: 8px; border: 1px solid #ddd;">${data.message}</td></tr>` : ""}
    </table>
    <p style="margin-top: 16px; color: #666;">관리자 페이지에서 확인하세요.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `[두비전 가맹문의] ${data.name}님의 새 상담 신청`,
    html,
  });
}
