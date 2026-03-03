import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ShortService } from "./short.service";

@ApiTags("Short Links")
@Controller("short")
export class ShortController {
  constructor(private readonly shortService: ShortService) {}

  @Post()
  async create(@Body("feedVideoId") feedVideoId: string) {
    return this.shortService.create(feedVideoId);
  }

  @Get(":code")
  async resolve(@Param("code") code: string) {
    const feedVideoId = await this.shortService.resolve(code);
    return { feedVideoId };
  }
}
