/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaDto } from './categoria.dto';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';

@UseGuards(JwtAuthGuard)
@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  @Roles(Role.ADMIN, Role.READALL)
  async findAll() {
    return await this.categoriaService.findAll();
  }

  @Get(':CategoriaId')
  @Roles(Role.ADMIN, Role.READALL)
  async findOne(@Param('CategoriaId') CategoriaId: string) {
    return await this.categoriaService.findOne(CategoriaId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USERW)
  async create(@Body() categoriaDto: CategoriaDto) {
    const Categoria: CategoriaEntity = plainToInstance(CategoriaEntity, categoriaDto);
    return await this.categoriaService.create(Categoria);
  }

  @Put(':CategoriaId')
  @Roles(Role.ADMIN, Role.USERW)
  async update(@Param('CategoriaId') CategoriaId: string, @Body() categoriaDto: CategoriaDto) {
    const Categoria: CategoriaEntity = plainToInstance(CategoriaEntity, categoriaDto);
    return await this.categoriaService.update(CategoriaId, Categoria);
  }

  @Delete(':CategoriaId')
  @Roles(Role.ADMIN, Role.USERD)
  @HttpCode(204)
  async delete(@Param('CategoriaId') CategoriaId: string) {
    return await this.categoriaService.delete(CategoriaId);
  }
}
