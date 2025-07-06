import { createHmac } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

interface EmailData {
  to: string;
  template: string;
  data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export class EmailHandler {
  private readonly config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  };

  private transporter: any; // Will be initialized dynamically
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private async loadTemplates() {
    // Templates will be loaded dynamically
    this.templates.set('welcome', {
      subject: 'Welcome to RescuePC Repairs',
      text: 'Welcome to RescuePC Repairs!',
      html: '<h1>Welcome to RescuePC Repairs!</h1>'
    });
  }

  public async sendEmail(emailData: EmailData): Promise<void> {
    try {
      // Dynamically import nodemailer only on the server
      const nodemailer = await import('nodemailer');
      
      if (!this.transporter) {
        this.transporter = nodemailer.createTransport(this.config);
      }

      const template = this.templates.get(emailData.template);
      if (!template) {
        throw new Error(`Template ${emailData.template} not found`);
      }

      const processedTemplate = this.processTemplate(template, emailData.data);
      const signature = this.generateSignature(emailData);

      await this.transporter.sendMail({
        from: `"RescuePC Repairs" <${this.config.auth.user}>`,
        to: emailData.to,
        subject: processedTemplate.subject,
        text: processedTemplate.text,
        html: processedTemplate.html,
        attachments: emailData.attachments
      });

      await this.logEmail(emailData, signature);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  private processTemplate(template: EmailTemplate, data: Record<string, any>): EmailTemplate {
    let subject = template.subject;
    let text = template.text;
    let html = template.html;

    // Replace variables in template
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      text = text.replace(regex, value);
      html = html.replace(regex, value);
    }

    return { subject, text, html };
  }

  private generateSignature(data: any): string {
    return createHmac('sha256', process.env.AI_SYNC_SECRET!)
      .update(JSON.stringify(data))
      .digest('hex');
  }

  private async logEmail(emailData: EmailData, signature: string) {
    const fs = require('fs').promises;
    const path = require('path');

    const logDir = 'logs/emails';
    const logFile = path.join(logDir, `${new Date().toISOString().split('T')[0]}.log`);

    const logEntry = {
      timestamp: new Date().toISOString(),
      template: emailData.template,
      to: emailData.to,
      signature,
      attachments: emailData.attachments?.map((a) => a.filename)
    };

    try {
      await fs.mkdir(logDir, { recursive: true });
      await fs.appendFile(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to log email:', error);
    }
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection verification failed:', error);
      return false;
    }
  }

  public async reloadTemplates(): Promise<void> {
    this.templates.clear();
    this.loadTemplates();
  }
}
