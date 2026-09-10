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
}

export const emailService = new EmailService();
