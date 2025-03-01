import { EmailProvider, EMAIL_PROVIDERS, EMAIL_CONFIG } from './config';

// Interfaz para datos de email
export interface EmailMessage {
  from: { name: string; email: string };
  to: { name: string; email: string }[];
  cc?: { name: string; email: string }[];
  bcc?: { name: string; email: string }[];
  subject: string;
  content: string;
  attachments?: {
    name: string;
    content?: string; // Base64 o URL
    path?: string;
    type?: string;
    size?: number;
  }[];
  templateId?: string;
  templateData?: Record<string, any>;
}

// Interfaz para respuesta de envío
export interface SendResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Clase base para adaptadores de servicios de email
export abstract class EmailServiceAdapter {
  protected provider: EmailProvider;
  protected config: any;

  constructor(provider: EmailProvider) {
    this.provider = provider;
    this.config = EMAIL_PROVIDERS[provider]?.config || {};
  }

  abstract sendEmail(message: EmailMessage): Promise<SendResponse>;
  abstract getTemplates?(): Promise<any[]>;
}

// Adaptador para SMTP genérico
export class SmtpAdapter extends EmailServiceAdapter {
  constructor(provider: EmailProvider = EmailProvider.SMTP) {
    super(provider);
  }

  async sendEmail(message: EmailMessage): Promise<SendResponse> {
    try {
      // En un entorno real, aquí se utilizaría nodemailer u otra biblioteca
      // para enviar el email a través de SMTP
      console.log('Enviando email a través de SMTP:', {
        provider: this.provider,
        config: this.config.smtp,
        message
      });

      // Simulamos una llamada a la API
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      const data = await response.json();
      return {
        success: data.success,
        messageId: data.messageId,
        error: data.error
      };
    } catch (error) {
      console.error('Error al enviar email por SMTP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Adaptador para Mailchimp (Mandrill)
export class MailchimpAdapter extends EmailServiceAdapter {
  constructor() {
    super(EmailProvider.MAILCHIMP);
  }

  async sendEmail(message: EmailMessage): Promise<SendResponse> {
    try {
      console.log('Enviando email a través de Mailchimp (Mandrill):', {
        apiKey: this.config.api.apiKey,
        message
      });

      // Transformar el mensaje al formato de Mandrill
      const mandrillMessage = {
        key: this.config.api.apiKey,
        message: {
          html: message.content,
          subject: message.subject,
          from_email: message.from.email,
          from_name: message.from.name,
          to: message.to.map(recipient => ({
            email: recipient.email,
            name: recipient.name,
            type: 'to'
          })),
          attachments: message.attachments?.map(attachment => ({
            name: attachment.name,
            type: attachment.type,
            content: attachment.content // Base64
          }))
        }
      };

      // Simulamos una llamada a la API de Mandrill
      const response = await fetch('/api/email/providers/mailchimp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mandrillMessage)
      });

      const data = await response.json();
      return {
        success: data.success,
        messageId: data.messageId,
        error: data.error
      };
    } catch (error) {
      console.error('Error al enviar email por Mailchimp:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getTemplates(): Promise<any[]> {
    try {
      // Simulamos obtener las plantillas de Mandrill
      const response = await fetch('/api/email/providers/mailchimp/templates', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('Error al obtener plantillas de Mailchimp:', error);
      return [];
    }
  }
}

// Adaptador para Sendinblue (Brevo)
export class SendinblueAdapter extends EmailServiceAdapter {
  constructor() {
    super(EmailProvider.SENDINBLUE);
  }

  async sendEmail(message: EmailMessage): Promise<SendResponse> {
    try {
      console.log('Enviando email a través de Sendinblue (Brevo):', {
        apiKey: this.config.api.apiKey,
        message
      });

      // Transformar el mensaje al formato de Sendinblue
      const sendinblueMessage = {
        sender: {
          name: message.from.name,
          email: message.from.email
        },
        to: message.to.map(recipient => ({
          email: recipient.email,
          name: recipient.name
        })),
        cc: message.cc?.map(recipient => ({
          email: recipient.email,
          name: recipient.name
        })),
        bcc: message.bcc?.map(recipient => ({
          email: recipient.email,
          name: recipient.name
        })),
        subject: message.subject,
        htmlContent: message.content,
        attachment: message.attachments?.map(attachment => ({
          name: attachment.name,
          content: attachment.content // Base64
        })),
        templateId: message.templateId,
        params: message.templateData
      };

      // Simulamos una llamada a la API de Sendinblue
      const response = await fetch('/api/email/providers/sendinblue/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.api.apiKey
        },
        body: JSON.stringify(sendinblueMessage)
      });

      const data = await response.json();
      return {
        success: data.success,
        messageId: data.messageId,
        error: data.error
      };
    } catch (error) {
      console.error('Error al enviar email por Sendinblue:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getTemplates(): Promise<any[]> {
    try {
      // Simulamos obtener las plantillas de Sendinblue
      const response = await fetch('/api/email/providers/sendinblue/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.api.apiKey
        }
      });

      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('Error al obtener plantillas de Sendinblue:', error);
      return [];
    }
  }
}

// Adaptador para SendGrid
export class SendGridAdapter extends EmailServiceAdapter {
  constructor() {
    super(EmailProvider.SENDGRID);
  }

  async sendEmail(message: EmailMessage): Promise<SendResponse> {
    try {
      console.log('Enviando email a través de SendGrid:', {
        apiKey: this.config.api.apiKey,
        message
      });

      // Transformar el mensaje al formato de SendGrid
      const sendgridMessage = {
        personalizations: [
          {
            to: message.to.map(recipient => ({
              email: recipient.email,
              name: recipient.name
            })),
            cc: message.cc?.map(recipient => ({
              email: recipient.email,
              name: recipient.name
            })),
            bcc: message.bcc?.map(recipient => ({
              email: recipient.email,
              name: recipient.name
            })),
            subject: message.subject,
            dynamic_template_data: message.templateData
          }
        ],
        from: {
          email: message.from.email,
          name: message.from.name
        },
        subject: message.subject,
        content: [
          {
            type: 'text/html',
            value: message.content
          }
        ],
        attachments: message.attachments?.map(attachment => ({
          filename: attachment.name,
          type: attachment.type,
          content: attachment.content // Base64
        })),
        template_id: message.templateId
      };

      // Simulamos una llamada a la API de SendGrid
      const response = await fetch('/api/email/providers/sendgrid/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api.apiKey}`
        },
        body: JSON.stringify(sendgridMessage)
      });

      const data = await response.json();
      return {
        success: data.success,
        messageId: data.messageId,
        error: data.error
      };
    } catch (error) {
      console.error('Error al enviar email por SendGrid:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getTemplates(): Promise<any[]> {
    try {
      // Simulamos obtener las plantillas de SendGrid
      const response = await fetch('/api/email/providers/sendgrid/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.api.apiKey}`
        }
      });

      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('Error al obtener plantillas de SendGrid:', error);
      return [];
    }
  }
}

// Adaptador para Postmark
export class PostmarkAdapter extends EmailServiceAdapter {
  constructor() {
    super(EmailProvider.POSTMARK);
  }

  async sendEmail(message: EmailMessage): Promise<SendResponse> {
    try {
      console.log('Enviando email a través de Postmark:', {
        apiKey: this.config.api.apiKey,
        message
      });

      // Transformar el mensaje al formato de Postmark
      const postmarkMessage = {
        From: `${message.from.name} <${message.from.email}>`,
        To: message.to.map(recipient => `${recipient.name} <${recipient.email}>`).join(','),
        Cc: message.cc?.map(recipient => `${recipient.name} <${recipient.email}>`).join(','),
        Bcc: message.bcc?.map(recipient => `${recipient.name} <${recipient.email}>`).join(','),
        Subject: message.subject,
        HtmlBody: message.content,
        Attachments: message.attachments?.map(attachment => ({
          Name: attachment.name,
          Content: attachment.content, // Base64
          ContentType: attachment.type
        })),
        TemplateId: message.templateId,
        TemplateModel: message.templateData
      };

      // Simulamos una llamada a la API de Postmark
      const response = await fetch('/api/email/providers/postmark/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': this.config.api.apiKey
        },
        body: JSON.stringify(postmarkMessage)
      });

      const data = await response.json();
      return {
        success: data.success,
        messageId: data.messageId,
        error: data.error
      };
    } catch (error) {
      console.error('Error al enviar email por Postmark:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  async getTemplates(): Promise<any[]> {
    try {
      // Simulamos obtener las plantillas de Postmark
      const response = await fetch('/api/email/providers/postmark/templates', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Postmark-Server-Token': this.config.api.apiKey
        }
      });

      const data = await response.json();
      return data.templates || [];
    } catch (error) {
      console.error('Error al obtener plantillas de Postmark:', error);
      return [];
    }
  }
}

// Adaptador para Amazon SES
export class AmazonSESAdapter extends EmailServiceAdapter {
  constructor() {
    super(EmailProvider.AMAZON_SES);
  }

  async sendEmail(message: EmailMessage): Promise<SendResponse> {
    try {
      console.log('Enviando email a través de Amazon SES:', {
        apiKey: this.config.api.apiKey,
        region: this.config.api.region,
        message
      });

      // Transformar el mensaje al formato de Amazon SES
      const sesMessage = {
        Source: `${message.from.name} <${message.from.email}>`,
        Destination: {
          ToAddresses: message.to.map(recipient => `${recipient.name} <${recipient.email}>`),
          CcAddresses: message.cc?.map(recipient => `${recipient.name} <${recipient.email}>`),
          BccAddresses: message.bcc?.map(recipient => `${recipient.name} <${recipient.email}>`)
        },
        Message: {
          Subject: {
            Data: message.subject
          },
          Body: {
            Html: {
              Data: message.content
            }
          }
        },
        // AWS SES no maneja adjuntos directamente, se necesitaría MIME
        // o usar una biblioteca como nodemailer
      };

      // Simulamos una llamada a la API de Amazon SES
      const response = await fetch('/api/email/providers/amazon-ses/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...sesMessage,
          credentials: {
            accessKeyId: this.config.api.apiKey,
            secretAccessKey: this.config.api.secretKey,
            region: this.config.api.region
          }
        })
      });

      const data = await response.json();
      return {
        success: data.success,
        messageId: data.messageId,
        error: data.error
      };
    } catch (error) {
      console.error('Error al enviar email por Amazon SES:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }
}

// Factory para crear el adaptador adecuado según el proveedor
export class EmailServiceFactory {
  static createAdapter(provider: EmailProvider = EMAIL_CONFIG.defaultProvider): EmailServiceAdapter {
    switch (provider) {
      case EmailProvider.MAILCHIMP:
        return new MailchimpAdapter();
      case EmailProvider.SENDINBLUE:
        return new SendinblueAdapter();
      case EmailProvider.SENDGRID:
        return new SendGridAdapter();
      case EmailProvider.POSTMARK:
        return new PostmarkAdapter();
      case EmailProvider.AMAZON_SES:
        return new AmazonSESAdapter();
      case EmailProvider.GMAIL:
      case EmailProvider.OUTLOOK:
      case EmailProvider.YAHOO:
      case EmailProvider.SMTP:
      case EmailProvider.IMAP:
      default:
        return new SmtpAdapter(provider);
    }
  }
} 