import {
  Controller,
  Get,
  Render,
  Param,
  Res,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { Response, Request } from "express";
import * as path from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render("index")
  getHome() {
    return {
      title: "Accueil",
      message: "Bienvenue sur la page d’accueil 🎉",
    };
  }

  @Get("/cgu-pro")
  @Render("cgu-pro")
  getCguPro() {
    return {
      title: "Conditions Générales d'Utilisation - ImmoPlus Pro",
    };
  }

  @Get("/cgu-pro")
  @Render("cgu-pro")
  getCguCustomer() {
    return {
      title: "Conditions Générales d'Utilisation - ImmoPlus Pro",
    };
  }

  @Get("/cgu-customer")
  @Render("cgu-customer")
  getCguParticulier() {
    return {
      title: "Conditions Générales d'Utilisation - ImmoPlus Particulier",
    };
  }

  @Get("/payment/:collection/:itemId")
  getPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Param("collection") collection: string,
    @Param("itemId") itemId: string,
  ) {
    const status = (req.query.status as string) || "waiting_for_validation";

    if (!["demandes-visites", "reservations"].includes(collection)) {
      return res.status(HttpStatus.BAD_REQUEST).send("Collection invalide");
    }

    const data = {
      title: "Paiement",
      collection,
      itemId,
      status,
    };

    return res.render("payment", data);
  }

  @Get("/.well-known/assetlinks.json")
  getAssetLinks(@Res() res: Response) {
    return res.sendFile(
      path.join(__dirname, "../public/.well-known/assetlinks.json"),
    );
  }

  @Get("/.well-known/apple-app-site-association")
  getAppleAppSiteAssociation(@Res() res: Response) {
    return res.sendFile(
      path.join(__dirname, "../public/.well-known/apple-app-site-association"),
    );
  }
}
