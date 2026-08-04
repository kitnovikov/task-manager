import { Resend } from 'resend'

export default class SMTPService {
    constructor(config, logger) {
        this.token = config.get('SMTP_RESEND_TOKEN')
        this.logger = logger
        this.transporter = new Resend(this.token)
    }

    async send(email, subject, html) {
        const { data, error } = await this.transporter.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject,
            html,
        })

        if (error) {
            this.logger.error('Error sending email', {
                email: email,
                err: error,
                service: 'smtp-service',
            })
        }

        if (data) {
            this.logger.info('Email message has been sent successfully', {
                email: email,
                messageId: data.id,
                service: 'smtp-service',
            })
        }
    }
}