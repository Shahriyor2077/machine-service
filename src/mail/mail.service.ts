import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    user: { email: string; full_name: string; isActivated?: string },
    type: "user" | "admin" = "user"
  ) {
    const url =
      type === "admin"
        ? `${process.env.api_url}/api/admin/activate/${user.isActivated}`
        : `${process.env.api_url}/api/auth/activate/${user.isActivated}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to App!",
      template: "confirmation",
      context: {
        username: user.full_name,
        url
      },
    });
  }
}


