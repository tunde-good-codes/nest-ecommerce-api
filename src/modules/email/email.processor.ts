import { Processor, Process } from "@nestjs/bull";
import type { Job } from "bull";
import { EmailService } from "./email.service";
import { User } from "@prisma/client";

@Processor("email")
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process("send-welcome")
  async handleWelcomeEmail(job: Job<{ user: User }>) {
    const { user } = job.data;

    console.log("📨 Processing email job for:", user.email);

    await this.emailService.sendUserWelcome(user);
  }
}
