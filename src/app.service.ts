import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor() {}

  hello() {
    return "hello world!";
  }
}
