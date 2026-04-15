import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

dotenv.config();

let transporter;
const WR_FOOTER_LOGO_CID = 'wr-logo-footer';
const WR_HEADER_GREEN_GRADIENT = 'linear-gradient(135deg, #0f6e56 0%, #10b981 100%)';
const WR_LOGO_URL = process.env.EMAIL_LOGO_URL || 'https://www.whichrenewables.com/logos/wr.png';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveNewsletterLogoPath = () => {
  const candidates = [
    path.resolve(__dirname, '../../../public/logos/wr.png'),
    path.resolve(__dirname, '../../../build/logos/wr.png'),
    path.resolve(__dirname, '../../../public/wr.png'),
    path.resolve(__dirname, '../../../build/wr.png'),
    path.resolve(__dirname, '../../public/logos/wr.png'),
    path.resolve(__dirname, '../../build/logos/wr.png'),
    path.resolve(__dirname, '../public/logos/wr.png'),
    path.resolve(__dirname, '../build/logos/wr.png'),
    path.resolve(__dirname, '../../public/wr.png'),
    path.resolve(__dirname, '../../build/wr.png'),
    path.join(process.cwd(), 'public', 'logos', 'wr.png'),
    path.join(process.cwd(), 'build', 'logos', 'wr.png'),
    path.join(process.cwd(), '..', 'public', 'logos', 'wr.png'),
    path.join(process.cwd(), '..', 'build', 'logos', 'wr.png'),
    path.join(process.cwd(), 'public', 'wr.png'),
    path.join(process.cwd(), 'build', 'wr.png'),
    path.join(process.cwd(), '..', 'public', 'wr.png'),
    path.join(process.cwd(), '..', 'build', 'wr.png'),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

const stripBrokenCidLogos = (html) => {
  if (typeof html !== 'string' || html.length === 0) return html;

  return html.replace(
    /<img[^>]*src=["']cid:(wr-logo|wr-logo-footer|whichrenewables-logo)["'][^>]*>/gi,
    '<h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 16px;">Which Renewables</h3>'
  );
};

const normalizeFooterLogoCid = (html) => {
  if (typeof html !== 'string' || html.length === 0) return html;
  return html
    .replace(/cid:wr-logo-footer/gi, `cid:${WR_FOOTER_LOGO_CID}`)
    .replace(/cid:wr-logo/gi, `cid:${WR_FOOTER_LOGO_CID}`)
    .replace(/cid:whichrenewables-logo/gi, `cid:${WR_FOOTER_LOGO_CID}`);
};

const replaceLogoCidWithUrl = (html, logoUrl) => {
  if (typeof html !== 'string' || html.length === 0) return html;
  if (!logoUrl) return stripBrokenCidLogos(html);

  return html.replace(
    /src=["']cid:(wr-logo|wr-logo-footer|whichrenewables-logo)["']/gi,
    `src="${logoUrl}"`
  );
};

const applyGlobalEmailHeaderTheme = (html) => {
  if (typeof html !== 'string' || html.length === 0) return html;
  return html.replace(/linear-gradient\([^)]*\)/gi, WR_HEADER_GREEN_GRADIENT);
};

const buildGlobalFooterHtml = (logoUrl) => `
  <div data-wr-global-footer="true" style="padding: 25px 20px; text-align: center; margin-top: 16px; border-top: 1px solid #e5e7eb;">
    ${logoUrl
      ? `<img src="${logoUrl}" alt="Which Renewables" style="height: 62px; margin: 0 auto 12px auto; display: block;" />`
      : '<h3 style="color: #10b981; margin: 0 0 12px 0; font-size: 16px;">Which Renewables</h3>'}
    <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
    <p style="color: #6b7280; font-size: 12px; margin: 4px 0;">1-7, Park Road, Caterham, England - CR3 5TB</p>
    <p style="color: #6b7280; font-size: 12px; margin: 4px 0;">
      <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
    </p>
  </div>
`;

const applyGlobalEmailFooter = (mailOptions) => {
  const nextOptions = { ...mailOptions };
  const logoUrl = WR_LOGO_URL;

  const attachments = Array.isArray(nextOptions.attachments) ? [...nextOptions.attachments] : [];

  if (typeof nextOptions.html === 'string') {
    nextOptions.html = applyGlobalEmailHeaderTheme(nextOptions.html);
    nextOptions.html = normalizeFooterLogoCid(nextOptions.html);
    nextOptions.html = replaceLogoCidWithUrl(nextOptions.html, logoUrl);

    const standardizedFooterHtml = buildGlobalFooterHtml(logoUrl);
    if (nextOptions.html.includes('data-wr-global-footer="true"')) {
      nextOptions.html = nextOptions.html.replace(
        /<div[^>]*data-wr-global-footer="true"[^>]*>[\s\S]*?<\/div>/i,
        standardizedFooterHtml
      );
    } else {
      nextOptions.html = `${nextOptions.html}${standardizedFooterHtml}`;
    }
  }

  const filteredAttachments = attachments.filter((attachment) => {
    const cid = String(attachment?.cid || '').toLowerCase();
    return cid !== 'wr-logo' && cid !== 'whichrenewables-logo' && cid !== WR_FOOTER_LOGO_CID;
  });

  if (filteredAttachments.length > 0) {
    nextOptions.attachments = filteredAttachments;
  } else {
    delete nextOptions.attachments;
  }

  return nextOptions;
};

const sendBrandedEmail = (mail, mailOptions) => mail.sendMail(applyGlobalEmailFooter(mailOptions));

const getMailConfig = () => {
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpSecure = process.env.SMTP_SECURE === 'true';
  const emailService = process.env.EMAIL_SERVICE || (smtpHost ? 'smtp' : 'gmail');

  const fromEmail = process.env.SMTP_FROM_EMAIL || smtpUser || 'noreply@whichrenewables.com';
  const fromName = process.env.SMTP_FROM_NAME || 'Which Renewables';
  const from = fromEmail ? `${fromName} <${fromEmail}>` : fromName;

  return {
    smtpUser,
    smtpPass,
    smtpHost,
    smtpPort,
    smtpSecure,
    emailService,
    from,
  };
};

const resolveInvoiceBackgroundPath = () => {
  const candidates = [
    path.join(process.cwd(), 'public', 'invoice.jpg'),
    path.join(process.cwd(), 'build', 'invoice.jpg'),
    path.join(process.cwd(), '..', 'public', 'invoice.jpg'),
    path.join(process.cwd(), '..', 'build', 'invoice.jpg'),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
};

const formatGBP = (amount) => `£ ${Number.isFinite(amount) ? amount.toFixed(2) : '0.00'}`;

const buildInvoiceNumber = () => `WR-${Date.now().toString().slice(-8)}`;

const generateInvoicePdf = async ({
  username,
  planName,
  billingCycle,
  addonNames = [],
  totalAmount,
  planPrice,       // optional: actual plan price
  addonPrices = [], // optional: array of prices per addon, matching addonNames order
}) => {
  const parsedTotal = Number(totalAmount);
  const grandTotal = Number.isFinite(parsedTotal) ? parsedTotal : 0;
  const subTotal = grandTotal > 0 ? grandTotal / 1.2 : 0;
  const vatAmount = grandTotal > 0 ? grandTotal - subTotal : 0;
  const invoiceDate = new Date().toLocaleDateString('en-GB');
  const invoiceNo = buildInvoiceNumber();
  const cleanAddons = Array.isArray(addonNames) ? addonNames.filter(Boolean) : [];

  // Build line items with individual prices when available
  const lineItems = [];
  const planLabel = `${planName || 'Subscription Plan'} (${billingCycle || 'monthly'})`;
  if (planPrice != null && Number.isFinite(Number(planPrice))) {
    lineItems.push({ name: planLabel, amount: Number(planPrice) });
  } else if (cleanAddons.length === 0) {
    lineItems.push({ name: planLabel, amount: grandTotal });
  } else {
    // No individual prices supplied — fall back to plan getting remaining after addons
    const addonSum = addonPrices.reduce((s, p) => s + (Number.isFinite(Number(p)) ? Number(p) : 0), 0);
    lineItems.push({ name: planLabel, amount: grandTotal - addonSum });
  }

  cleanAddons.forEach((name, idx) => {
    const addonPrice = addonPrices[idx];
    const amount = addonPrice != null && Number.isFinite(Number(addonPrice))
      ? Number(addonPrice)
      : grandTotal / (cleanAddons.length + 1); // fallback: equal split
    lineItems.push({ name: `Add-on: ${name}`, amount });
  });

  const finalItems = lineItems.length > 0 ? lineItems : [{ name: 'Subscription Purchase', amount: grandTotal }];

  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Colour palette matching the Which Renewables invoice reference
  const dark        = rgb(0.13, 0.16, 0.19);   // near-black body text
  const white       = rgb(1, 1, 1);
  const green       = rgb(0.09, 0.45, 0.14);   // #177024 – brand green
  const lightGreen  = rgb(0.87, 0.95, 0.87);   // table header background
  const midGrey     = rgb(0.55, 0.55, 0.55);   // secondary text
  const lineGrey    = rgb(0.82, 0.82, 0.82);   // divider lines
  const grandBg     = rgb(0.09, 0.45, 0.14);   // grand total bar fill

  const pageWidth  = 595;
  const pageHeight = 842;
  const margin     = 40;

  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const drawText = (text, x, y, size = 11, bold = false, color = dark) => {
    page.drawText(String(text ?? ''), { x, y, size, font: bold ? fontBold : fontRegular, color });
  };

  const drawLine = (x1, y1, x2, y2, thickness = 0.75, color = lineGrey) => {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color });
  };

  const drawRect = (x, y, w, h, fillColor) => {
    page.drawRectangle({ x, y, width: w, height: h, color: fillColor });
  };

  const wrapText = (text, maxWidth, size = 10) => {
    const words = String(text ?? '').split(' ');
    const lines = [];
    let current = '';
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (fontRegular.widthOfTextAtSize(next, size) <= maxWidth) {
        current = next;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 3);
  };

  // ── 1. Green leaf header band ─────────────────────────────────────────────
  const headerH = 90;
  drawRect(0, pageHeight - headerH, pageWidth, headerH, green);

  // "Which Renewables" text logo in white (replaces image if unavailable)
  const bgPath = resolveInvoiceBackgroundPath();
  if (bgPath) {
    try {
      const imageBytes = fs.readFileSync(bgPath);
      const bgImage = bgPath.toLowerCase().endsWith('.png')
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);
      // Draw as header strip, cropped to top portion
      page.drawImage(bgImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });
    } catch (_) { /* fall through to text fallback */ }
  }

  // ── 2. Company address block (below header, left) ────────────────────────
  drawRect(0, pageHeight - headerH - 95, 300, 95, rgb(1,1,1));
  let addrY = pageHeight - headerH - 22;
  drawText('Which Renewables', margin, addrY, 10, true, green);
  drawText('1-7, Park Road, Caterham', margin, addrY - 14, 9, false, midGrey);
  drawText('England - CR3 5TB', margin, addrY - 26, 9, false, midGrey);

  // ── 3. Invoice meta (date / number) – right column ───────────────────────
  const metaLabelX = pageWidth - 200;
  const metaValueX = pageWidth - 100;
  const metaY1 = pageHeight - headerH - 22;
  const metaY2 = metaY1 - 18;

  drawText('Invoice Date :', metaLabelX, metaY1, 10, true, dark);
  drawText(invoiceDate,      metaValueX, metaY1, 10, false, dark);
  drawText('Invoice No   :', metaLabelX, metaY2, 10, true, dark);
  drawText(invoiceNo,        metaValueX, metaY2, 10, false, dark);

  // ── 4. Thin divider ───────────────────────────────────────────────────────
  drawLine(margin, pageHeight - headerH - 55, pageWidth - margin, pageHeight - headerH - 55);

  // ── 5. "To:" recipient block ─────────────────────────────────────────────
  const toY = pageHeight - headerH - 75;
  drawText('To :', margin, toY, 10, false, midGrey);
  drawText(username || 'Customer', margin, toY - 16, 12, true, green);
  drawText('Which Renewables Platform', margin, toY - 30, 9, false, midGrey);

  // ── 6. Table header ───────────────────────────────────────────────────────
  const tableTop = toY - 55;
  const tableBottom = tableTop - 16;
  drawRect(margin, tableBottom, pageWidth - margin * 2, 20, lightGreen);
  drawLine(margin, tableTop + 4, pageWidth - margin, tableTop + 4, 1.5, green);
  drawLine(margin, tableBottom - 1, pageWidth - margin, tableBottom - 1, 1.5, green);

  const colQty   = margin + 10;
  const colDesc  = margin + 65;
  const colPrice = pageWidth - 175;
  const colTotal = pageWidth - 75;

  drawText('QTY',         colQty,   tableBottom + 5, 9, true, dark);
  drawText('DESCRIPTION', colDesc,  tableBottom + 5, 9, true, dark);
  drawText('PRICE',       colPrice, tableBottom + 5, 9, true, dark);
  drawText('TOTAL',       colTotal, tableBottom + 5, 9, true, dark);

  // ── 7. Line items ─────────────────────────────────────────────────────────
  let rowY = tableBottom - 20;
  const rowHeight = 52;

  finalItems.forEach((item, idx) => {
    // Alternating very light background
    if (idx % 2 === 0) {
      drawRect(margin, rowY - rowHeight + 14, pageWidth - margin * 2, rowHeight, rgb(0.97, 0.99, 0.97));
    }

    const descLines = wrapText(item.name, 200, 10);
    const centerY = rowY - 4;

    drawText('01',                    colQty,   centerY,      11, true,  dark);
    drawText(descLines[0] || item.name, colDesc, centerY,    10, true,  dark);
    if (descLines[1]) drawText(descLines[1], colDesc, centerY - 13, 9, false, midGrey);
    if (descLines[2]) drawText(descLines[2], colDesc, centerY - 26, 9, false, midGrey);

    drawText(formatGBP(item.amount), colPrice, centerY, 10, true, dark);
    drawText(formatGBP(item.amount), colTotal, centerY, 10, true, dark);

    rowY -= rowHeight;
  });

  // ── 8. Bottom table divider ───────────────────────────────────────────────
  const afterTableY = rowY + rowHeight - 10;
  drawLine(margin, afterTableY, pageWidth - margin, afterTableY, 1.5, green);

  // ── 9. Totals section ─────────────────────────────────────────────────────
  const totalsY = afterTableY - 22;

  drawText('Payment Method', margin, totalsY, 10, true, dark);
  drawText('Card',           margin, totalsY - 16, 10, false, dark);

  drawText('Sub Total',  colPrice - 20, totalsY,      10, true,  dark);
  drawText(formatGBP(subTotal), colTotal, totalsY,      10, false, dark);

  drawText('VAT @ 20%', colPrice - 20, totalsY - 18, 10, true,  dark);
  drawText(formatGBP(vatAmount), colTotal, totalsY - 18, 10, false, dark);

  // ── 10. Grand Total bar ───────────────────────────────────────────────────
  const gtBarY = totalsY - 50;
  const gtBarH = 26;
  drawRect(colPrice - 30, gtBarY, pageWidth - margin - (colPrice - 30), gtBarH, grandBg);
  drawText('Grand Total',          colPrice - 22, gtBarY + 8, 10, true,  white);
  drawText(formatGBP(grandTotal),  colTotal,      gtBarY + 8, 10, true,  white);

  // ── 11. Footer ────────────────────────────────────────────────────────────
  const footerY = 50;
  drawLine(margin, footerY + 18, pageWidth - margin, footerY + 18, 0.5, lineGrey);

  // ── Finalise ──────────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const cleanInvoiceNo = invoiceNo.replace(/[^A-Z0-9-]/gi, '');
  return {
    buffer: Buffer.from(pdfBytes),
    fileName: `WhichRenewables-Invoice-${cleanInvoiceNo}.pdf`,
    invoiceNo,
    invoiceDate,
  };
};

export const generateSampleInvoicePdf = async (outputPath) => {
  const invoice = await generateInvoicePdf({
    username: 'Sample Customer',
    planName: 'Business Growth Plan',
    billingCycle: 'monthly',
    addonNames: ['Featured Listing', 'Priority Support'],
    totalAmount: 299.99,
  });

  const destination = outputPath || path.join(process.cwd(), 'sample-invoice.pdf');
  fs.writeFileSync(destination, invoice.buffer);

  return {
    filePath: destination,
    invoiceNo: invoice.invoiceNo,
    invoiceDate: invoice.invoiceDate,
  };
};

// Initialize email transporter
const initializeTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.USE_ETHEREAL === 'true') {
    // Use Ethereal Email for development/testing
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('✓ Using Ethereal Email for testing');
  } else {
    const cfg = getMailConfig();

    if (!cfg.smtpUser || !cfg.smtpPass) {
      throw new Error('Missing SMTP credentials. Set SMTP_USER and SMTP_PASSWORD (or EMAIL_USER and EMAIL_PASS).');
    }

    if (cfg.emailService === 'gmail') {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cfg.smtpUser,
          pass: cfg.smtpPass,
        },
      });
      console.log('✓ Using Gmail for email service');
    } else {
      transporter = nodemailer.createTransport({
        host: cfg.smtpHost,
        port: cfg.smtpPort,
        secure: cfg.smtpSecure,
        auth: {
          user: cfg.smtpUser,
          pass: cfg.smtpPass,
        },
      });
      console.log('✓ Using SMTP for email service');
    }
  }

  return transporter;
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();

    const mailOptions = {
      from: cfg.from,
      to: email,
      subject: 'Your OTP for Which Renewables Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Email Verification</h2>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hello,</p>
            <p style="color: #666; font-size: 14px;">Your One-Time Password (OTP) for Which Renewables registration is:</p>
            
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea;">
              <h1 style="color: #667eea; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px;"><strong>Important:</strong> This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email and do not share it with anyone.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p data-wr-global-footer="true" style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Which Renewables. All rights reserved.<br>
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const info = await sendBrandedEmail(mail, mailOptions);

    if (process.env.EMAIL_DEBUG === 'true') {
      console.log(`✓ OTP sent to ${email}`);
      if (info.testMessageUrl) {
        console.log(`Preview URL: ${info.testMessageUrl}`);
      }
    }

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, username) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();

    const mailOptions = {
      from: cfg.from,
      to: email,
      subject: 'Welcome to Which Renewables!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h2 style="margin: 0;">Welcome to Which Renewables!</h2>
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px;">Hello ${username},</p>
            <p style="color: #666; font-size: 14px;">Thank you for creating an account with Which Renewables. Your account has been successfully created and verified.</p>
            
            <p style="color: #666; font-size: 14px;">You can now:</p>
            <ul style="color: #666; font-size: 14px;">
              <li>Complete your profile</li>
              <li>Browse renewable energy solutions</li>
              <li>Connect with industry experts</li>
              <li>Access exclusive resources</li>
            </ul>
            
            <p style="color: #666; font-size: 14px;">Get started by completing your profile: <a href="http://localhost:3000/profile-completion" style="color: #667eea; text-decoration: none;">Complete Profile</a></p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p data-wr-global-footer="true" style="color: #999; font-size: 12px; text-align: center;">
              © 2026 Which Renewables. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await sendBrandedEmail(mail, mailOptions);

    if (process.env.EMAIL_DEBUG === 'true') {
      console.log(`✓ Welcome email sent to ${email}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error.message);
    return { success: false };
  }
};

// Send contact form submission to admin
export const sendAdminContactEmail = async (payload) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();

    let adminTo = 'admin@whichrenewables.com';
    if (payload?.type === 'financial') {
      adminTo = 'finance@whichrenewables.com';
    }
    if (payload?.type === 'sales') {
      adminTo = 'sales@whichrenewables.com';
    }
    if (payload?.type === 'support') {
      adminTo = 'support@whichrenewables.com';
    }
    if (payload?.type === 'feedback') {
      adminTo = 'feedback@whichrenewables.com';
    }
    if (payload?.type === 'workWithUs') {
      adminTo = 'admin@whichrenewables.com';
    }
    if (payload?.type === 'planningConsultation' || payload?.type === 'planning') {
      adminTo = 'admin@whichrenewables.com';
    }

    const safe = (v) => (v === undefined || v === null ? '' : String(v));
    const type = safe(payload?.type);
    const name = safe(payload?.name || payload?.contactName || payload?.projectName);
    const email = safe(payload?.email || payload?.contactEmail);
    const phone = safe(payload?.phone || payload?.contactPhone);
    const companyName = safe(payload?.companyName);
    const companyAddress = safe(payload?.companyAddress);
    const postCode = safe(payload?.postCode);
    const companyWebsite = safe(payload?.companyWebsite);
    const sectors = safe(payload?.sectors);
    const productsServices = safe(payload?.productsServices);
    const briefIntro = safe(payload?.briefIntro);
    const collaborationType = safe(payload?.collaborationType);
    const bestTime = safe(payload?.bestTime);

    // Planning specific fields
    const consultationType = safe(payload?.consultationType || payload?.supportType);
    const specificArea = safe(payload?.subCategory);
    const projectLocation = safe(payload?.projectLocation || payload?.location);
    const projectValue = safe(payload?.projectValue || payload?.budgetRange);
    const supportType = safe(payload?.supportType || payload?.consultationType);
    const timeframe = safe(payload?.timeframe || payload?.timeline);
    const preferredContact = safe(payload?.preferredContact);
    const phoneNumber = safe(payload?.phoneNumber || payload?.phone);
    const additionalNotes = safe(
      payload?.additionalNotes ||
      payload?.projectDescription ||
      [payload?.budgetRange ? `Budget Range: ${payload.budgetRange}` : '', payload?.timeline ? `Preferred Timeline: ${payload.timeline}` : '']
        .filter(Boolean)
        .join('\n')
    );

    // Combine issueCategory (frontend) and category
    const category = safe(payload?.category || payload?.issueCategory);
    const subCategory = safe(payload?.subCategory);
    const invoiceNumber = safe(payload?.invoiceNumber);
    const priority = safe(payload?.priority);
    const supportQuery = safe(payload?.supportQuery);
    const errorMessage = safe(payload?.errorMessage);
    const issueDescription = safe(payload?.issueDescription);
    const natureOfEnquiry = safe(payload?.natureOfEnquiry);

    // Feedback specific fields
    const rating = safe(payload?.rating);
    const role = safe(payload?.role);
    const improvementArea = safe(payload?.improvementArea);
    const retryLikelihood = safe(payload?.retryLikelihood);
    const likedMost = safe(payload?.likedMost);
    const positiveFeedback = safe(payload?.positiveFeedback);
    const recommendation = safe(payload?.recommendation);
    const testimonialConsent = safe(payload?.testimonialConsent);
    // Keep for backward compatibility
    const subject = safe(payload?.subject);
    const feedback = safe(payload?.feedback);
    const recommend = safe(payload?.recommend);
    const improvements = safe(payload?.improvements);

    let subjectLine;
    if (type === 'sales') {
      subjectLine = 'Sales & Marketing Enquiry Received';
    } else if (type === 'financial') {
      subjectLine = `Financial Enquiry Received - ${category || 'General'}`;
    } else if (type === 'support') {
      subjectLine = `Technical Support Ticket - ${priority || 'Low'} Priority - ${supportQuery || 'General Inquiry'}`;
    } else {
      const subjectParts = ['Contact Form', type || 'submission'];
      if (category) subjectParts.push(category);
      if (supportQuery) subjectParts.push(supportQuery);
      if (type === 'feedback' && subject) subjectParts.push(subject);
      subjectLine = subjectParts.filter(Boolean).join(' - ');
    }

    const isImage = Boolean(payload?.file?.mimetype?.startsWith('image/'));
    const attachments = [];

    // Add uploaded file attachment if exists
    if (payload?.file && fs.existsSync(payload.file.path)) {
      attachments.push({
        filename: payload.file.originalname,
        path: payload.file.path,
        contentType: payload.file.mimetype,
        cid: isImage ? 'contact-upload' : undefined
      });
    }

    // Add WR logo attachment
    const logoPath = resolveNewsletterLogoPath();
    if (logoPath) {
      attachments.push({
        filename: 'wr-logo.png',
        path: logoPath,
        cid: 'wr-logo'
      });
    }

    const mailOptions = {
      from: cfg.from,
      to: adminTo,
      replyTo: email || undefined,
      subject: subjectLine,
      attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #0f6e56 0%, #10b981 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            ${logoPath ? `<img src="cid:wr-logo" alt="Which Renewables" style="height: 50px; margin-bottom: 15px;" />` : ''}
            <h2 style="color: white; margin: 0;">${type === 'workWithUs' ? 'New Collaboration Request' : type === 'feedback' ? 'New Feedback Received' : type === 'financial' ? 'New Financial Enquiry' : type === 'support' ? 'New Technical Support Ticket' : type === 'planningConsultation' || type === 'planning' ? 'New Planning Consultation Request' : 'New Contact Us Submission'}</h2>
            <p style="color: #01a80f; margin: 5px 0 0;">Type: ${type.toUpperCase()}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">Contact Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Name:</td><td>${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Email:</td><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Company:</td><td>${companyName}</td></tr>
                ${invoiceNumber ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #555;">Invoice #:</td><td>${invoiceNumber}</td></tr>` : ''}
              </table>
            </div>

            ${isImage ? `
            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Attached Image Preview</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <img src="cid:contact-upload" alt="${payload?.file?.originalname || 'attachment'}" style="max-width: 100%; height: auto; border-radius: 6px;" />
              </div>
            </div>
            ` : ''}

            ${type === 'workWithUs' ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Collaboration Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Contact Person:</td><td>${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Email:</td><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Phone:</td><td>${phone}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Company Name:</td><td>${companyName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Address:</td><td>${companyAddress}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Post Code:</td><td>${postCode}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Website:</td><td>${companyWebsite}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Best Time to Contact:</td><td>${bestTime}</td></tr>
              </table>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Service Sectors</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${sectors || 'Not provided'}</div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Products & Services</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${productsServices || 'Not provided'}</div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Brief Introduction</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${briefIntro || 'Not provided'}</div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Collaboration Type</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${collaborationType || 'Not provided'}</div>
            </div>

            ${payload?.file ? `
            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Attached CV/Document</h4>
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; border: 1px solid #3b82f6;">
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  <strong>Filename:</strong> ${payload.file.originalname || 'attachment'}<br/>
                  <strong>Size:</strong> ${(payload.file.size / 1024).toFixed(1)} KB<br/>
                  <strong>Type:</strong> ${payload.file.mimetype || 'unknown'}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">The file is attached to this email.</p>
              </div>
            </div>
            ` : ''}
            ` : ''}

            ${type === 'planningConsultation' || type === 'planning' ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Planning Consultation Enquiry</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Project Name:</td><td>${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Consultation Type:</td><td>${consultationType || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Specific Area:</td><td>${specificArea || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Project Location:</td><td>${projectLocation || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Project Value / Budget Range:</td><td>${projectValue || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Preferred Timeline:</td><td>${timeframe || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Preferred Contact:</td><td>${preferredContact || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Phone Number:</td><td>${phoneNumber || 'Not provided'}</td></tr>
              </table>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Support Required</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${supportType || 'Not provided'}</div>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">Additional Notes</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${additionalNotes || 'Not provided'}</div>
            </div>
            ` : ''}

            ${type === 'feedback' ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Feedback Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${rating ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Rating:</td><td><span style="background-color: ${parseInt(rating) >= 4 ? '#dcfce7' : parseInt(rating) >= 3 ? '#fef9c3' : '#fee2e2'}; color: ${parseInt(rating) >= 4 ? '#166534' : parseInt(rating) >= 3 ? '#854d0e' : '#991b1b'}; padding: 4px 12px; border-radius: 4px; font-weight: bold;">${rating} / 5</span></td></tr>` : ''}
                ${role ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Role:</td><td>${role}</td></tr>` : ''}
                ${improvementArea ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Area for Improvement:</td><td>${improvementArea}</td></tr>` : ''}
                ${likedMost ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Liked Most:</td><td>${likedMost}</td></tr>` : ''}
                ${retryLikelihood ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Retry Likelihood:</td><td>${retryLikelihood}</td></tr>` : ''}
                ${recommendation ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Recommendation:</td><td>${recommendation}</td></tr>` : ''}
                ${testimonialConsent ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Testimonial Consent:</td><td><span style="background-color: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 4px;">Yes</span></td></tr>` : ''}
              </table>
            </div>

            ${issueDescription ? `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4b5563; margin-bottom: 8px;">What Went Wrong</h4>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${issueDescription}</div>
              </div>` : ''}

            ${improvements ? `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4b5563; margin-bottom: 8px;">How Can We Improve</h4>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${improvements}</div>
              </div>` : ''}

            ${positiveFeedback ? `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4b5563; margin-bottom: 8px;">Positive Feedback</h4>
                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; border: 1px solid #bbf7d0; white-space: pre-wrap;">${positiveFeedback}</div>
              </div>` : ''}
            
            ` : ''}

            ${type === 'sales' ? `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Sales & Marketing Enquiry Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Name:</td><td>${name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Email:</td><td><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Company:</td><td>${companyName || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Main Category:</td><td>${category || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; width: 180px; color: #555;">Sub Category:</td><td>${subCategory || 'Not provided'}</td></tr>
              </table>
            </div>

            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">How can Which Renewables help you?</h4>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${natureOfEnquiry || 'No details provided'}</div>
            </div>
            ` : `
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Inquiry Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${category ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Category:</td><td>${category}</td></tr>` : ''}
                ${subCategory ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Sub Category:</td><td>${subCategory}</td></tr>` : ''}
                ${invoiceNumber ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Invoice Number:</td><td><code style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px;">${invoiceNumber}</code></td></tr>` : ''}
                ${priority ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Priority:</td><td><span style="background-color: ${priority === 'Critical' ? '#fee2e2' : priority === 'High' ? '#ffedd5' : '#dbeafe'}; color: ${priority === 'Critical' ? '#991b1b' : priority === 'High' ? '#9a3412' : '#1e40af'}; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${priority}</span></td></tr>` : ''}
                ${supportQuery ? `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Support Query:</td><td>${supportQuery}</td></tr>` : ''}
              </table>
            </div>

            ${natureOfEnquiry ? `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4b5563; margin-bottom: 8px;">Nature of Enquiry</h4>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${natureOfEnquiry}</div>
              </div>` : ''}
              
            ${errorMessage ? `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4b5563; margin-bottom: 8px;">Error Message</h4>
                <div style="background-color: #fee2e2; color: #991b1b; padding: 15px; border-radius: 6px; border: 1px solid #fecaca; white-space: pre-wrap;">${errorMessage}</div>
              </div>` : ''}
              
            ${issueDescription ? `
              <div style="margin-bottom: 20px;">
                <h4 style="color: #4b5563; margin-bottom: 8px;">Issue Description</h4>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${issueDescription}</div>
              </div>` : ''}
            `}

            ${payload?.file ? `
            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 8px;">📎 Attached File</h4>
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; border: 1px solid #3b82f6;">
                <p style="margin: 0; font-size: 14px; color: #1e40af;">
                  <strong>Filename:</strong> ${payload.file.originalname || 'attachment'}<br/>
                  <strong>Size:</strong> ${(payload.file.size / 1024).toFixed(1)} KB<br/>
                  <strong>Type:</strong> ${payload.file.mimetype || 'unknown'}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">The file is attached to this email.</p>
              </div>
            </div>
            ` : ''}

            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              This inquiry was submitted via the Which Renewables ${type === 'workWithUs' ? 'Work With Us' : 'Contact Us'} page.<br>
              Received on: ${new Date().toLocaleString()}
            </p>
          </div>

          <!-- Footer -->
          <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
            <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
              1-7, Park Road, Caterham, England - CR3 5TB
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
              <a href="mailto:support@whichrenewables.com" style="color: #2563eb; text-decoration: none;">support@whichrenewables.com</a> |
              <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
            </p>
          </div>
        </div>
      `,
      };

      await sendBrandedEmail(mail, mailOptions);
      return { success: true };
  } catch (error) {
    console.error('Error sending admin contact email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send Finance Contact Email
export const sendFinanceContactEmail = async (contactData) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();

    const { name, email, phone, companyName, fundingAmount, projectDescription, contactId, file } = contactData;

    const financeTo = 'finance@whichrenewables.com';

    // Build attachments array
    const attachments = [];
    
    // Add uploaded file attachment if exists
    if (file && fs.existsSync(file.path)) {
      const isImage = Boolean(file?.mimetype?.startsWith('image/'));
      attachments.push({
        filename: file.originalname,
        path: file.path,
        contentType: file.mimetype,
        cid: isImage ? 'finance-upload' : undefined
      });
    }

    // Add WR logo attachment
    const logoPath = resolveNewsletterLogoPath();
    if (logoPath) {
      attachments.push({
        filename: 'wr-logo.png',
        path: logoPath,
        cid: 'wr-logo'
      });
    }

    // Admin Notification
    const mailOptions = {
      from: cfg.from,
      to: financeTo,
      replyTo: email || undefined,
      subject: `New Finance & Funding Inquiry: ${name} - ${companyName}`,
      attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">New Finance Inquiry</h2>
            <p style="color: #e0e7ff; margin: 5px 0 0;">Which Renewables - Finance & Funding</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Company:</strong> ${companyName}</p>
            </div>

            <div style="margin-bottom: 25px;">
              <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Project Details</h3>
              <p><strong>Funding Amount:</strong> <span style="background-color: #dbeafe; padding: 2px 6px; border-radius: 4px; color: #1e40af; font-weight: bold;">${fundingAmount}</span></p>
              <p><strong>Description:</strong></p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                ${projectDescription}
              </div>
              ${file ? `<p style="margin-top: 15px;"><strong>Attachment:</strong> <span style="background-color: #dcfce7; padding: 2px 6px; border-radius: 4px; color: #15803d;">${file.originalname}</span></p>` : ''}
            </div>

            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
              This inquiry was submitted via the Finance & Funding contact form.<br>
              Received on: ${new Date().toLocaleString()}
            </p>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:finance@whichrenewables.com" style="color: #2563eb; text-decoration: none;">finance@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await sendBrandedEmail(mail, mailOptions);

    // User Confirmation with Reference Number
    const userConfirmationOptions = {
      from: cfg.from,
      to: email,
      subject: 'Your Financial Enquiry Has Been Received',
      attachments: logoPath ? [{ filename: 'wr-logo.png', path: logoPath, cid: 'wr-logo' }] : [],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">Inquiry Received</h2>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Dear ${name},</p>
            <p>Thank you for contacting the <strong>Which Renewables Finance Team.</strong></p>
            <p>Your enquiry has been successfully submitted, and a member of our team will review your request shortly.</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Reference Number:</strong> ${contactId || 'N/A'}</p>
            </div>
            
            <p>We aim to respond within <strong>2-3 business days.</strong></p>
            
            ${file ? `<p style="font-size: 12px; color: #6b7280; margin-top: 15px;"><strong>Attachment:</strong> ${file.originalname} has been received with your inquiry.</p>` : ''}
            
            <p style="margin-top: 20px;">Kind regards,</p>
            <p><strong style="color: #10b981;">Which Renewables Financial Enquiry Team</strong></p>
            <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
              <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
            </p>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:finance@whichrenewables.com" style="color: #2563eb; text-decoration: none;">finance@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        </div>
      `
    };

    await sendBrandedEmail(mail, userConfirmationOptions);

    console.log(`✓ Finance contact emails sent for ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending finance contact email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async ({ email, name, resetLink }) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="color: white; margin: 0;">Password Reset Request</h2>
          <p style="color: #e0e7ff; margin: 5px 0 0;">Which Renewables</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi ${name || 'there'},</p>
          <p>We received a request to reset your password. If you made this request, please click the button below to proceed. This link will expire in 30 minutes.</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset Password</a>
          </div>
          
          <p style="font-size: 12px; color: #6b7280;">If you did not request a password reset, you can safely ignore this email.</p>
          
          <p data-wr-global-footer="true" style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            © 2026 Which Renewables. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendBrandedEmail(mail, {
      from: cfg.from,
      to: email,
      subject: 'Reset your Which Renewables password',
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter user confirmation
export const sendNewsletterUserConfirmation = async (subscriberEmail) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();
    const logoPath = resolveNewsletterLogoPath();
    const logoSection = logoPath
      ? '<div style="text-align: center; margin-bottom: 16px;"><img src="cid:whichrenewables-logo" alt="Which Renewables" style="max-height: 58px; width: auto;"></div>'
      : '';

    const mailOptions = {
      from: cfg.from,
      to: subscriberEmail,
      subject: "You're successfully subscribed to Which Renewables newsletter",
      attachments: logoPath
        ? [
            {
              filename: path.basename(logoPath),
              path: logoPath,
              cid: 'whichrenewables-logo',
            },
          ]
        : [],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">Subscription Confirmed!</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            ${logoSection}
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 14px;">You're successfully subscribed to Which Renewables newsletter.</p>
            <p style="font-size: 14px;">You'll now receive the latest insights and updates on renewable energy straight to your inbox.</p>
            
            <p data-wr-global-footer="true" style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              © 2026 Which Renewables. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await sendBrandedEmail(mail, mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending newsletter user confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter admin notification
export const sendAdminNewsletterEmail = async (subscriberEmail) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();
    const logoPath = resolveNewsletterLogoPath();

    const mailOptions = {
      from: cfg.from,
      to: 'sanjaymaheshwaran0124@gmail.com',
      subject: 'New Newsletter Subscription',
      attachments: logoPath
        ? [
            {
              filename: path.basename(logoPath),
              path: logoPath,
              cid: 'wr-logo',
            },
          ]
        : [],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">New Newsletter Subscription</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px;">Hello Admin,</p>
            <p style="font-size: 14px;">A new user has subscribed to the Which Renewables newsletter!</p>
            <p style="font-size: 14px; font-weight: bold;">Subscriber Email: <a href="mailto:${subscriberEmail}">${subscriberEmail}</a></p>
            
            <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Received on: ${new Date().toLocaleString()}
            </p>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              ${logoPath ? `<img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />` : ''}
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:support@whichrenewables.com" style="color: #2563eb; text-decoration: none;">support@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await sendBrandedEmail(mail, mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending admin newsletter email:', error);
    return { success: false, error: error.message };
  }
};

export const sendSubscriptionPurchaseConfirmationEmail = async ({
  email,
  username,
  planName,
  billingCycle,
  addonNames = [],
  addonPrices = [],
  totalAmount,
}) => {
  try {
    if (!email) {
      return { success: false, error: 'Missing recipient email' };
    }

    const mail = await initializeTransporter();
    const cfg = getMailConfig();
    const displayName = username || 'there';
    const addonsHtml = Array.isArray(addonNames) && addonNames.length > 0
      ? `<li style="margin: 6px 0;"><strong>Add-ons:</strong> ${addonNames.join(', ')}</li>`
      : '';
    const totalHtml = totalAmount !== undefined && totalAmount !== null
      ? `<li style="margin: 6px 0;"><strong>Total Paid:</strong> £${Number(totalAmount).toFixed(2)}</li>`
      : '';
    const invoiceAttachment = await generateInvoicePdf({
      username: displayName,
      planName,
      billingCycle,
      addonNames,
      addonPrices,
      totalAmount,
    });

    const mailOptions = {
      from: cfg.from,
      to: email,
      subject: 'Your Which Renewables subscription is confirmed',
      attachments: [
        {
          filename: invoiceAttachment.fileName,
          content: invoiceAttachment.buffer,
          contentType: 'application/pdf',
        },
      ],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">Subscription Confirmation</h2>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px;">Hello ${displayName},</p>
            <p style="font-size: 14px;">Thank you for purchasing your subscription on Which Renewables.</p>
            <p style="font-size: 14px;">Your payment was successful and your subscription is now active.</p>
            <ul style="padding-left: 20px; margin: 18px 0; font-size: 14px;">
              <li style="margin: 6px 0;"><strong>Plan:</strong> ${planName || 'N/A'}</li>
              <li style="margin: 6px 0;"><strong>Billing Cycle:</strong> ${billingCycle || 'monthly'}</li>
              ${addonsHtml}
              ${totalHtml}
            </ul>
            <p style="font-size: 14px;"><strong>Invoice attached:</strong> Please find your PDF invoice attached to this email.</p>
            <p style="font-size: 14px;">If you have any questions, reply to this email and our team will help you.</p>
            <p data-wr-global-footer="true" style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              © 2026 Which Renewables. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    const info = await sendBrandedEmail(mail, mailOptions);
    if (process.env.EMAIL_DEBUG === 'true') {
      console.log(`✓ Subscription confirmation email sent to ${email}`);
      if (info?.testMessageUrl) {
        console.log(`Preview URL: ${info.testMessageUrl}`);
      }
      if (info?.messageId) {
        console.log(`Message ID: ${info.messageId}`);
      }
    }
    return { success: true, messageId: info?.messageId };
  } catch (error) {
    console.error('Error sending subscription purchase confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// SR#89/90 - Send acknowledgement email to customer after contact/feedback form submission
export const sendContactAcknowledgementEmail = async (payload) => {
  try {
    const mail = await initializeTransporter();
    const cfg = getMailConfig();

    const name = payload?.name || payload?.contactName || 'there';
    const email = payload?.email || payload?.contactEmail;
    if (!email) return { success: false, error: 'No customer email' };

    const typeLabels = {
      feedback: 'Feedback',
      support: 'Technical Support',
      sales: 'Sales Enquiry',
      finance: 'Finance Enquiry',
      workWithUs: 'Work With Us',
      planningConsultation: 'Planning Consultation',
    };
    const typeLabel = typeLabels[payload?.type] || 'Enquiry';

    // Generate enquiry reference number
    const enquiryId = `WR-SM-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Add WR logo attachment
    const attachments = [];
    const logoPath = resolveNewsletterLogoPath();
    if (logoPath) {
      attachments.push({
        filename: 'wr-logo.png',
        path: logoPath,
        cid: 'wr-logo'
      });
    }

    // Sales & Marketing specific template
    if (payload?.type === 'sales') {
      const mailOptions = {
        from: cfg.from,
        to: email,
        subject: 'Sales & Marketing Enquiry Received',
        attachments,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="color: white; margin: 0; font-size: 20px;">Sales & Marketing Enquiry Received</h2>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; color: #333;">Dear ${name},</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;">Thank you for contacting the <strong>Which Renewables Sales & Marketing Team</strong>.</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;">Your enquiry has been received and we will respond as soon as possible.</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;"><strong>Reference Number:</strong> ${enquiryId}</p>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Kind regards,<br/>
                <strong style="color: #10b981;">Which Renewables Sales & Marketing Team</strong><br/>
                <a href="https://www.whichrenewables.com/contact-us" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com/contact-us</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:sales@whichrenewables.com" style="color: #2563eb; text-decoration: none;">sales@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        `,
      };

      const info = await sendBrandedEmail(mail, mailOptions);
      return { success: true, messageId: info?.messageId, enquiryId };
    }

    // Feedback specific template
    if (payload?.type === 'feedback') {
      const mailOptions = {
        from: cfg.from,
        to: email,
        subject: 'Thank You for Your Feedback',
        attachments,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #333;">
            <div style="background-color: #ffffff; padding: 30px; border: none;">
              <p style="font-size: 14px; color: #333; margin: 0;">Dear ${name},</p>
              
              <p style="font-size: 14px; color: #333; margin-top: 20px;">Thank you for completing the <strong>Which Renewables Feedback Survey.</strong></p>
              
              <p style="font-size: 14px; color: #333; margin-top: 15px;">Your feedback helps us improve our platform and provide a better experience for our users and partners.</p>
              
              <p style="font-size: 14px; color: #333; margin-top: 15px;">We truly appreciate the time you have taken to share your thoughts with us.</p>
              
              <p style="font-size: 14px; color: #333; margin-top: 30px;">
                Kind regards,<br/>
                <strong style="color: #10b981;">Which Renewables Team</strong><br/>
                <a href="https://www.whichrenewables.com/contact-us" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com/contact-us</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:feedback@whichrenewables.com" style="color: #2563eb; text-decoration: none;">feedback@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        `,
      };

      const info = await sendBrandedEmail(mail, mailOptions);
      return { success: true, messageId: info?.messageId };
    }

    // Financial Enquiries specific template
    if (payload?.type === 'financial' || payload?.type === 'finance') {
      const enquiryId = `WR-FN-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const mailOptions = {
        from: cfg.from,
        to: email,
        subject: 'Your Financial Enquiry Has Been Received',
        attachments,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #051f46 0%, #10b981 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="color: white; margin: 0; font-size: 20px;">Your Financial Enquiry Has Been Received</h2>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; color: #333;">Dear ${name},</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;">Thank you for contacting the <strong>Which Renewables Finance Team</strong>.</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;">Your enquiry has been successfully submitted, and a member of our team will review your request shortly.</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;"><strong>Reference Number:</strong> ${enquiryId}</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;">We aim to respond within <strong>2-3 business days</strong>.</p>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Kind regards,<br/>
                <strong style="color: #10b981;">Which Renewables Financial Enquiry Team</strong><br/>
                <a href="https://www.whichrenewables.com/contact-us" style="color: #10b981; text-decoration: none;">www.whichrenewables.com/contact-us</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:finance@whichrenewables.com" style="color: #2563eb; text-decoration: none;">finance@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        `,
      };

      const info = await sendBrandedEmail(mail, mailOptions);
      return { success: true, messageId: info?.messageId, enquiryId };
    }

    // Technical Support specific template
    if (payload?.type === 'support') {
      const ticketId = `WR-TS-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const mailOptions = {
        from: cfg.from,
        to: email,
        subject: 'Technical Support Request Received',
        attachments,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="color: white; margin: 0;">Technical Support Request Received</h2>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 14px; color: #333; margin: 0;">Dear ${name},</p>
              
              <p style="font-size: 14px; color: #374151; margin-top: 20px;">Thank you for contacting the <strong>Which Renewables Technical Support Centre.</strong></p>
              
              <p style="font-size: 14px; color: #374151; margin-top: 15px;">Your request has been successfully submitted, and a support specialist will review it and respond to you shortly with an update.</p>
              
              <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Reference Number:</strong> ${ticketId}</p>
              </div>
              
              <p style="font-size: 14px; color: #374151; margin: 15px 0;">We aim to respond within <strong>24 Hours</strong></p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Kind regards,<br/>
                <strong style="color: #10b981;">Which Renewables Technical Support Team</strong><br/>
                <a href="https://www.whichrenewables.com/contact-us" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com/contact-us</a>
              </p>
            </div>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:support@whichrenewables.com" style="color: #2563eb; text-decoration: none;">support@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        `,
      };

      const info = await sendBrandedEmail(mail, mailOptions);
      return { success: true, messageId: info?.messageId, ticketId };
    }

    // Work With Us specific template
    if (payload?.type === 'workWithUs') {
      const enquiryId = `WR-WU-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const mailOptions = {
        from: cfg.from,
        to: email,
        subject: 'Thank You for Your Interest in Working With Us',
        attachments,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #051f46 0%, #2563eb 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
              <h2 style="color: white; margin: 0; font-size: 20px;">Thank You for Your Interest in Working With Us</h2>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; color: #333;">Dear ${name},</p>

              <p style="font-size: 14px; color: #374151; margin-top: 20px;">Thank you for contacting <strong>Which Renewables</strong> regarding opportunities to work with us.</p>

              <p style="font-size: 14px; color: #374151;">We have received your enquiry, and our team will review your submission shortly.</p>

              <p style="font-size: 14px; color: #374151;">If your enquiry relates to a partnership or collaboration opportunity, the relevant team member will be in touch.</p>

              <div style="background: #f0f9ff; border: 1px solid #e5e7eb; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Reference Number</p>
                <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #1e40af; font-family: monospace;">${enquiryId}</p>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Kind regards,<br/>
                <strong style="color: #10b981;">Which Renewables HR Team</strong><br/>
                <a href="https://www.whichrenewables.com/contact-us" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com/contact-us</a>
              </p>
            </div>

            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              <img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:support@whichrenewables.com" style="color: #2563eb; text-decoration: none;">support@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        `,
      };

      const info = await sendBrandedEmail(mail, mailOptions);
      return { success: true, messageId: info?.messageId, enquiryId };
    }

    // Generic template for other types
    const mailOptions = {
      from: cfg.from,
      to: email,
      subject: `We received your ${typeLabel} — Which Renewables`,
      attachments,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #051f46 0%, #0f6e56 100%); padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            ${logoPath ? `<img src="cid:wr-logo" alt="Which Renewables" style="height: 50px; margin-bottom: 15px;" />` : '<h2 style="color: white; margin: 0; font-family: Georgia, serif;">Which Renewables</h2>'}
          </div>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px;">Hi ${name},</p>
            <p style="font-size: 14px; color: #374151;">Thank you for getting in touch. We have received your <strong>${typeLabel}</strong> and a member of our team will be in touch with you shortly.</p>
            <div style="background: #ffffff; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 14px; color: #374151;">If your enquiry is urgent, please email us directly at <a href="mailto:support@whichrenewables.com" style="color: #10b981;">support@whichrenewables.com</a></p>
            </div>
            <p style="font-size: 14px; color: #6b7280;">Kind regards,<br/><strong>The Which Renewables Team</strong></p>
            
            <!-- Footer -->
            <div data-wr-global-footer="true" style="padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0 0 15px 0;">© 2026 Which Renewables. All rights reserved.</p>
              ${logoPath ? `<img src="cid:wr-logo" alt="Which Renewables" style="height: 40px; margin-bottom: 15px;" />` : ''}
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                1-7, Park Road, Caterham, England - CR3 5TB
              </p>
              <p style="color: #6b7280; font-size: 12px; margin: 5px 0;">
                <a href="mailto:support@whichrenewables.com" style="color: #2563eb; text-decoration: none;">support@whichrenewables.com</a> |
                <a href="https://www.whichrenewables.com" style="color: #2563eb; text-decoration: none;">www.whichrenewables.com</a>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await sendBrandedEmail(mail, mailOptions);
    return { success: true, messageId: info?.messageId };
  } catch (error) {
    console.error('Error sending contact acknowledgement email:', error);
    return { success: false, error: error.message };
  }
};
