/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoCaracteristicoDto } from './producto-caracteristico.dto';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';
import { ProductoCaracteristicoService } from './producto-caracteristico.service';

@UseGuards(JwtAuthGuard)
@Controller('productocaracteristico')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoCaracteristicoController {
    constructor(private readonly productoCaracteristicoService: ProductoCaracteristicoService) {}

  @Get()
  @Roles(Role.ADMIN, Role.READALL)
  async findAll() {
    return await this.productoCaracteristicoService.findAll();
  }

  @Get(':ProductoCaracteristicoId')
  @Roles(Role.ADMIN, Role.READALL)
  async findOne(@Param('ProductoCaracteristicoId') ProductoCaracteristicoId: string) {
    return await this.productoCaracteristicoService.findOne(ProductoCaracteristicoId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USERW)
  async create(@Body() productoCaracteristicoDto: ProductoCaracteristicoDto) {
    const ProductoCaracteristico: ProductoCaracteristicoEntity = plainToInstance(ProductoCaracteristicoEntity, productoCaracteristicoDto);
    return await this.productoCaracteristicoService.create(ProductoCaracteristico);
  }

  @Put(':ProductoCaracteristicoId')
  @Roles(Role.ADMIN, Role.USERW)
  async update(@Param('ProductoCaracteristicoId') ProductoCaracteristicoId: string, @Body() productoCaracteristicoDto: ProductoCaracteristicoDto) {
    const ProductoCaracteristico: ProductoCaracteristicoEntity = plainToInstance(ProductoCaracteristicoEntity, productoCaracteristicoDto);
    return await this.productoCaracteristicoService.update(ProductoCaracteristicoId, ProductoCaracteristico);
  }

  @Delete(':ProductoCaracteristicoId')
  @Roles(Role.ADMIN, Role.USERD)
  @HttpCode(204)
  async delete(@Param('ProductoCaracteristicoId') ProductoCaracteristicoId: string) {
    return await this.productoCaracteristicoService.delete(ProductoCaracteristicoId);
  }

}
