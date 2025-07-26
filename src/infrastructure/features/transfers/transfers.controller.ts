import { Deps } from '@/core/domain/common/ioc';
import { ITransferRepository } from '@/core/domain/transfers/i-transfer.repository';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequiredRoles } from '@/infrastructure/decorators';
import { Role, UserRole } from '@/core/domain/roles';
import { JwtAuthGuard } from '../auth';
import { CreateTransfersDto } from './dto/create-transfers.dto';
import { TransferDtoMapper } from '@/core/application/transfers/transfer-dto.mapper';
import { WrapperResponseDtoMapper } from '@/lib/responses';
import { SearchItemsParamsDto, SelectItemsParamsDto } from '@/infrastructure/http';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { WrapperResponseTransferDto, WrapperResponseTransferListDto } from './dto/transfer.dto';

@ApiTags('Transfers')
@Controller('transfers')
export class TransfersController {

    private readonly dtoMapper = new TransferDtoMapper();
    private readonly responseMapper = new WrapperResponseDtoMapper(this.dtoMapper);
    private readonly autoMapper = new WrapperResponseDtoMapper();
    constructor(
        @Inject(Deps.TransferRepository)
        private readonly repository: ITransferRepository,
      ) {
      }
    
      @ApiResponse({
        type: WrapperResponseTransferDto,
      })
      @Post()
      @RequiredRoles(UserRole.Admin)
      @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
      async create(
        @Body() payload: CreateTransfersDto,
        @CurrentUser("id") userId: string,
      ) {
        payload.createdBy = userId;
        const response = await this.repository.createOne(payload);
        return this.responseMapper.mapFrom(response);
      }
    
      @ApiResponse({
        type: WrapperResponseTransferListDto,
      })
      @Get()
      async readMany(
        @Query() params: SearchItemsParamsDto,
      ) {
        const items = await this.repository.findByQuery(params);
        return this.responseMapper.mapFromQueryResult(items);
      }
    
      @ApiResponse({
        type: WrapperResponseTransferDto,
      })
      @Get(":id")
      async readOne(
        @Param("id") id: string,
        @Query() params?: SelectItemsParamsDto,
      ) {
        const item = await this.repository.findOne(id, { fields: params?._select });
    
        return this.responseMapper.mapFrom(item);
      }
    
    
      @ApiResponse({
        type: WrapperResponseTransferDto,
      })
      @RequiredRoles(UserRole.Admin)
      @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
      @Patch(":id")
      async update(
        @Param("id") id: string,
        @CurrentUser("id") userId: string,
        @CurrentUser("role") userRole: Role,
        @Body() payload: UpdateTransferDto,
      ) {
        const query = {
          _where: [
            {
              _field: "id",
              _val: id,
            },
          ],
        };
    
        if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });
    
        await this.repository.updateByQuery(query, payload);
    
        return this.responseMapper.mapFrom((await this.repository.findByQuery(query)).data.at(0));
      }
    
    
      @ApiResponse({
        type: WrapperResponseTransferDto,
      })
      @RequiredRoles(UserRole.Admin)
      @UseGuards(JwtAuthGuard)
      @ApiBearerAuth()
      @Delete(":id")
      async delete(
        @Param("id") id: string,
        @CurrentUser("id") userId: string,
        @CurrentUser("role") userRole: Role) {
        const query = {
          _where: [
            {
              _field: "id",
              _val: id,
            },
          ],
        };
    
        if (!userRole.hasAdminAccess()) query._where.push({ _field: "createdBy", _val: userId });
    
        await this.repository.deleteByQuery(query);
    
        return this.responseMapper.mapFrom({ id } as never);
      }
}
