const dotenv = require("dotenv");
dotenv.config();

import { SendNotificationParams } from "@/core/domain/notifications";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let notificationService = new NotificationService(
    {
      getEnvVariable(varName: string) {
        return process.env[varName];
      },
    } as never,
    {
      findOne: jest.fn().mockResolvedValue({
        id: "",
        firstName: "",
        lastName: "",
      }),
    } as never,
    {} as never,
    {} as never,
    {
      error: jest.fn().mockImplementation((error) => console.log(error)),
    } as never,
  );

  describe("sendNotification", () => {
    const notificationParams: SendNotificationParams = {
      userId: "my-uniq-id",
      subject: "my-uniq-id",
      message: "my-uniq-id",
      sendMail: false,
      sendSms: false,
    };

    it("it should returns void", async () => {
      await expect(notificationService.sendNotification(notificationParams)).resolves.toBeUndefined();
    });
  });
});
