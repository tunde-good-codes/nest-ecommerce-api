import { NestFactory } from "@nestjs/core";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  Logger.error("Error starting server", error);
  process.exit(1);
});
