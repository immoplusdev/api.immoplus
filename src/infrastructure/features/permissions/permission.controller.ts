import { Body, Controller, Delete, Get, Post, Put, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';


@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor() {}
}
