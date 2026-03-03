import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "crypto";
import type { Redis } from "ioredis";
import { Deps } from "@/core/domain/common/ioc";
import { ShortLinkEntity } from "./short-link.entity";

const SHORT_CACHE_TTL = 60 * 60 * 24; // 24h en secondes

@Injectable()
export class ShortService {
  private readonly repo: Repository<ShortLinkEntity>;
  private readonly appUrl: string;

  constructor(
    @Inject(Deps.DataSource)
    readonly dataSource: DataSource,
    @Inject("REDIS_CLIENT")
    private readonly redis: Redis,
    private readonly config: ConfigService,
  ) {
    this.repo = dataSource.getRepository(ShortLinkEntity);
    this.appUrl = this.config.get<string>("APP_URL", "http://localhost:3000");
  }

  async create(
    feedVideoId: string,
  ): Promise<{ shortUrl: string; code: string }> {
    let code: string;
    let exists: ShortLinkEntity | null;

    // Générer un code unique
    do {
      code = randomBytes(4).toString("base64url").slice(0, 6);
      exists = await this.repo.findOneBy({ code });
    } while (exists);

    const link = this.repo.create({ code, feedVideoId });
    await this.repo.save(link);

    return { code, shortUrl: `${this.appUrl}/short/${code}` };
  }

  async resolve(code: string): Promise<string> {
    const cacheKey = `short:${code}`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const link = await this.repo.findOneBy({ code });
    if (!link) throw new NotFoundException(`Short link '${code}' introuvable`);

    await this.redis.setex(cacheKey, SHORT_CACHE_TTL, link.feedVideoId);
    return link.feedVideoId;
  }
}
