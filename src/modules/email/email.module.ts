import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { EmailProcessor } from "./email.processor";
import { EmailService } from "./email.service";
import { join } from "path";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email"
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow<string>("MAIL_HOST"),
          secure: false,
          port: 2525,
          auth: {
            user: config.get<string>("SMTP_USERNAME"),
            pass: config.get<string>("SMTP_PASSWORD")
          }
        },
        default: {
          from: "my blog <no-reply@nestjs.com>"
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: new EjsAdapter({
            inlineCssEnabled: true
          }),
          options: {
            strict: false
          }
        }
      })
    })
  ],
  providers: [EmailProcessor, EmailService],
  exports: [BullModule] // 👈 important
})
export class EmailModule {}
