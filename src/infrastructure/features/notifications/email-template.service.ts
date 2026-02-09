import { Injectable } from "@nestjs/common";
import {
  EmailTemplate,
  EmailTemplateData,
  IEmailTemplateService,
} from "@/core/domain/notifications/i-email-template.service";
import * as fs from "fs";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hbs = require("hbs");

@Injectable()
export class EmailTemplateService implements IEmailTemplateService {
  private readonly templatesDir: string;

  constructor() {
    this.templatesDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "templates",
      "emails",
    );
  }

  async render(
    template: EmailTemplate,
    data: EmailTemplateData,
  ): Promise<string> {
    const templatePath = path.join(this.templatesDir, `${template}.hbs`);
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = hbs.compile(templateContent);
    return compiledTemplate(data);
  }
}
