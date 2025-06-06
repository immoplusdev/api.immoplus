/* eslint-disable @typescript-eslint/no-var-requires */
// import { ConfigService } from "@nestjs/config";
// import { MailService } from "@/infrastructure/features/notifications";
// import { IMailService, SendMailParams } from "@/core/domain/notifications";
// import { LoggerService } from "../logging/logger.service";
// import { ConfigsManagerService } from "../configs/configs-manager.service";


// const dotenv = require("dotenv");
// dotenv.config();

// describe("NodemailerService", () => {
//   let mailingService: IMailService;
//   const configService = new ConfigService();


//   const configsManagerService = new ConfigsManagerService(new ConfigService());
//   const loggerService = new LoggerService(configsManagerService);

//   beforeEach(() => {
//     mailingService = new MailService(configsManagerService, loggerService);
//   });

//   describe("execute", () => {
//     const sendMailParams: SendMailParams = {
//       to: "mstx777@gmail.com", // list of receivers
//       subject: "Hello ✔", // Subject line
//       text: "Oh", // plain text body
//       html: "<b>Hello world?</b>", // html body
//     };

//     it("it should not return any exception", async () => {
//       await expect(mailingService.sendMail(sendMailParams)).rejects.toThrow(
//         new Error("Mail sender not working"),
//       );
//     });
//   });
// });
