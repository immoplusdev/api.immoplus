import { Body, Controller, Delete, Get, Post, Put, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';


@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor() {}
}
