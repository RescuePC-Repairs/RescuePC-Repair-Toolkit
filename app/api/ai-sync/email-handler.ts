import nodemailer from 'nodemailer';
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
    smtp: {
      host: process.env.SMTP_HOST!,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!
      }
    },
    from: process.env.EMAIL_FROM!,
    templatePath: 'emails/templates',
    attachmentPath: 'emails/attachments'
  };

  private transporter: nodemailer.Transporter;
  private templates: Map<string, EmailTemplate> = new Map();

  constructor() {
    this.transporter = nodemailer.createTransport(this.config.smtp);
    this.loadTemplates();
  }

  private loadTemplates() {
    const fs = require('fs');
    const path = require('path');
    const templatesDir = path.join(process.cwd(), this.config.templatePath);

    try {
      const templates = fs.readdirSync(templatesDir);
      for (const template of templates) {
        if (template.endsWith('.json')) {
          const templateName = template.replace('.json', '');
          const templatePath = path.join(templatesDir, template);
          const templateContent = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
          this.templates.set(templateName, templateContent);
        }
      }
      console.log(`Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.error('Failed to load email templates:', error);
    }
  }

  public async sendEmail(emailData: EmailData): Promise<void> {
    try {
      // Get template
      const template = this.templates.get(emailData.template);
      if (!template) {
        throw new Error(`Template ${emailData.template} not found`);
      }

      // Process template with data
      const processedTemplate = this.processTemplate(template, emailData.data);

      // Prepare email
      const mailOptions = {
        from: this.config.from,
        to: emailData.to,
        subject: processedTemplate.subject,
        text: processedTemplate.text,
        html: processedTemplate.html,
        attachments: emailData.attachments?.map((attachment) => ({
          filename: attachment.filename,
          path: join(this.config.attachmentPath, attachment.path)
        }))
      };

      // Send email
      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${emailData.to}`);

      // Generate signature for logging
      const signature = this.generateSignature({
        template: emailData.template,
        to: emailData.to,
        timestamp: new Date().toISOString()
      });

      // Log email
      await this.logEmail(emailData, signature);
    } catch (error) {
      console.error('Failed to send email:', error);
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
