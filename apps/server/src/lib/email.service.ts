import nodemailer from "nodemailer";
import { logger } from "./logger";

export interface BookingEmailData {
  to: string;
  guestName: string;
  confirmationNumber: string;
  roomName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  tax: number;
}

export interface FoodOrderEmailData {
  to: string;
  guestName: string;
  orderNumber: string;
  roomNumber?: string;
  total: number;
  tax: number;
  itemCount: number;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  /**
   * Send Booking Confirmation Email
   */
  async sendBookingConfirmation(data: BookingEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Georgia', serif; background-color: #F7F3EA; color: #1C1C1A; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #D9C7A3; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #183C32; padding-bottom: 24px; margin-bottom: 30px; }
          .title { font-size: 26px; color: #183C32; margin: 0 0 8px 0; }
          .subtitle { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #315C4A; }
          .code-box { background: #183C32; color: #D9C7A3; text-align: center; padding: 16px; margin: 24px 0; }
          .code { font-size: 24px; font-weight: bold; letter-spacing: 3px; font-family: monospace; }
          .details-table { width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px; }
          .details-table td { padding: 10px 0; border-bottom: 1px solid #ECE7DC; }
          .details-table td.label { color: #666; width: 40%; }
          .details-table td.val { font-weight: bold; color: #1C1C1A; text-align: right; }
          .footer { text-align: center; margin-top: 36px; padding-top: 20px; border-top: 1px solid #ECE7DC; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">Hotel Newlands Shimla</h1>
            <div class="subtitle">Colonial Himalayan Sanctuary • Est. 1928</div>
          </div>

          <p>Dear ${data.guestName},</p>
          <p>We are delighted to confirm your upcoming reservation amidst the cedar ridges of Shimla. Your fireside sanctuary awaits your arrival.</p>

          <div class="code-box">
            <div style="font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Reservation Confirmation Number</div>
            <div class="code">${data.confirmationNumber}</div>
          </div>

          <table class="details-table">
            <tr>
              <td class="label">Suite Reserved</td>
              <td class="val">${data.roomName} (${data.roomNumber})</td>
            </tr>
            <tr>
              <td class="label">Check-In Date</td>
              <td class="val">${data.checkIn} (From 2:00 PM)</td>
            </tr>
            <tr>
              <td class="label">Check-Out Date</td>
              <td class="val">${data.checkOut} (Until 11:00 AM)</td>
            </tr>
            <tr>
              <td class="label">Length of Stay</td>
              <td class="val">${data.nights} Night(s)</td>
            </tr>
            <tr>
              <td class="label">GST (18% Statutory)</td>
              <td class="val">₹${data.tax.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td class="label" style="font-size: 16px; color: #183C32;">Total Tariff (Paid)</td>
              <td class="val" style="font-size: 18px; color: #183C32;">₹${data.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>

          <p style="font-size: 13px; line-height: 1.6; color: #444;">
            Should you require estate chauffer transfers from Kalka or Jubbarhatti, or customized dietary arrangements at The Cedar Hearth, please reply to this transmission or contact our Concierge Desk.
          </p>

          <div class="footer">
            Hotel Newlands • The Ridge, Above Mall Road, Shimla, Himachal Pradesh 171001<br>
            Telephone: +91 177 000 0000 • Email: reservations@hotelnewlands.in
          </div>
        </div>
      </body>
      </html>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Hotel Newlands Shimla" <${process.env.SMTP_FROM || "reservations@hotelnewlands.in"}>`,
          to: data.to,
          subject: `Reservation Confirmed: #${data.confirmationNumber} — Hotel Newlands Shimla`,
          html,
        });
        logger.info(`Booking confirmation email dispatched to ${data.to}`);
      } catch (err: any) {
        logger.error(`Failed to send email to ${data.to}: ${err.message}`);
      }
    } else {
      logger.info(`[EmailService DEV] Booking confirmation email prepared for ${data.to} (#${data.confirmationNumber})`);
    }
  }

  /**
   * Send Cancellation & Refund Email
   */
  async sendCancellationNotice(to: string, guestName: string, confirmationNumber: string, refundAmount: number) {
    logger.info(`[EmailService] Cancellation email prepared for ${to} (#${confirmationNumber}, Refund: ₹${refundAmount})`);
  }

  /**
   * Send Official GST Tax Invoice & Checkout Receipt Email
   */
  async sendInvoiceReceipt(data: {
    to: string;
    guestName: string;
    invoiceNumber: string;
    confirmationNumber: string;
    roomName: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    subtotal: number;
    tax: number;
    food: number;
    extras: number;
    total: number;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
      category?: string;
    }>;
  }) {
    const itemsHtml = data.items
      .map(
        (it) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #ECE7DC; font-size: 13px;">${it.description}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #ECE7DC; text-align: center; font-size: 13px;">${it.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #ECE7DC; text-align: right; font-size: 13px;">₹${Number(it.unitPrice).toLocaleString("en-IN")}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #ECE7DC; text-align: right; font-weight: bold; font-size: 13px;">₹${Number(it.amount).toLocaleString("en-IN")}</td>
        </tr>`
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Georgia', serif; background-color: #F7F3EA; color: #1C1C1A; margin: 0; padding: 40px 20px; }
          .container { max-width: 650px; margin: 0 auto; background: #FFFFFF; border: 1px solid #D9C7A3; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; border-bottom: 2px solid #183C32; padding-bottom: 20px; margin-bottom: 25px; }
          .title { font-size: 24px; color: #183C32; margin: 0 0 6px 0; }
          .subtitle { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #315C4A; }
          .meta-row { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; }
          .inv-badge { background: #183C32; color: #D9C7A3; padding: 6px 14px; font-family: monospace; font-size: 14px; font-weight: bold; border-radius: 4px; display: inline-block; }
          .table-header { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table-header th { background: #F7F3EA; color: #183C32; padding: 8px; font-size: 11px; text-transform: uppercase; text-align: left; }
          .summary-table { width: 280px; margin-left: auto; margin-top: 20px; border-collapse: collapse; font-size: 13px; }
          .summary-table td { padding: 6px 0; }
          .footer { text-align: center; margin-top: 36px; padding-top: 20px; border-top: 1px solid #ECE7DC; font-size: 11px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">HOTEL NEWLANDS SHIMLA</h1>
            <div class="subtitle">Official GST Tax Invoice & Stay Folio • Est. 1928</div>
            <div style="font-size: 11px; color: #666; margin-top: 4px;">The Mall Road, Shimla, HP 171001 • GSTIN: 02AAACN1234F1Z5</div>
          </div>

          <div style="margin-bottom: 20px;">
            <div style="float: left;">
              <span style="font-size: 10px; text-transform: uppercase; color: #888; display: block;">Guest Details:</span>
              <strong>${data.guestName}</strong><br>
              <span style="font-size: 12px; color: #555;">Email: ${data.to}</span><br>
              <span style="font-size: 12px; color: #555;">Suite: ${data.roomName} (#${data.roomNumber})</span><br>
              <span style="font-size: 12px; color: #555;">Stay: ${data.checkIn} to ${data.checkOut}</span>
            </div>
            <div style="float: right; text-align: right;">
              <span style="font-size: 10px; text-transform: uppercase; color: #888; display: block;">Invoice Reference:</span>
              <div class="inv-badge">${data.invoiceNumber}</div><br>
              <span style="font-size: 12px; color: #555;">Booking: #${data.confirmationNumber}</span><br>
              <span style="font-size: 12px; color: #555;">Date: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div style="clear: both;"></div>
          </div>

          <table class="table-header">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="color: #666;">Subtotal:</td>
              <td style="text-align: right;">₹${data.subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="color: #666;">GST (Room 18% & Food 5%):</td>
              <td style="text-align: right;">₹${data.tax.toLocaleString("en-IN")}</td>
            </tr>
            <tr style="border-top: 2px solid #183C32; font-weight: bold; font-size: 15px; color: #183C32;">
              <td style="padding-top: 8px;">Total Paid:</td>
              <td style="padding-top: 8px; text-align: right;">₹${data.total.toLocaleString("en-IN")}</td>
            </tr>
          </table>

          <div style="clear: both; margin-top: 30px; padding: 15px; background: #FAF7F0; border: 1px dashed #D9C7A3; border-radius: 6px; font-size: 12px; color: #555;">
            Thank you for staying at Hotel Newlands Shimla. We trust your time amidst the Himalayan cedar ridges was memorable and restorative.
          </div>

          <div class="footer">
            Hotel Newlands Shimla • The Ridge, Above Mall Road, Shimla, Himachal Pradesh 171001<br>
            Estate Desk: +91 177 000 0000 • Email: billing@hotelnewlands.in • www.hotelnewlands.in
          </div>
        </div>
      </body>
      </html>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"Hotel Newlands Shimla Billing" <${process.env.SMTP_FROM || "billing@hotelnewlands.in"}>`,
          to: data.to,
          subject: `Official GST Tax Invoice: ${data.invoiceNumber} — Hotel Newlands Shimla`,
          html,
        });
        logger.info(`Invoice email dispatched to ${data.to} (${data.invoiceNumber})`);
      } catch (err: any) {
        logger.error(`Failed to send invoice email to ${data.to}: ${err.message}`);
      }
    } else {
      logger.info(`[EmailService DEV] Invoice email prepared for ${data.to} (${data.invoiceNumber})`);
    }
  }
}

export const emailService = new EmailService();
