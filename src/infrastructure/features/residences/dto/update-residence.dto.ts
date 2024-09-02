import { ApiProperty } from "@nestjs/swagger";
import { enumToList, OmitMethods } from "@/lib/ts-utilities";
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Commodite, TypeResidence } from "@/core/domain/residences";
import { Piece } from "@/core/domain/residences/piece.model";
import { GeoJsonPoint } from "@/core/domain/map";
import { CommoditeDto, PieceDto } from "@/infrastructure/features/residences";
import { GeoJsonPointDto } from "@/core/application/shared/dto";

