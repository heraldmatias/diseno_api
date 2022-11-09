/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteEspecializadoDto } from './restaurante-especializado.dto';
import { RestauranteEspecializadoEntity } from './restaurante-especializado.entity';
import { RestauranteEspecializadoService } from './restaurante-especializado.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurantesespecializados')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteEspecializadoController {
  constructor(private readonly restauranteService: RestauranteEspecializadoService) {}

  @Get()
  @Roles(Role.ADMIN, Role.READALL)
  async findAll() {
    return await this.restauranteService.findAll();
  }

  @Get(':restauranteId')
  @Roles(Role.ADMIN, Role.READALL)
  async findOne(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.findOne(restauranteId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USERW)
  async create(@Body() restauranteDto: RestauranteEspecializadoDto) {
    const restaurante: RestauranteEspecializadoEntity = plainToInstance(RestauranteEspecializadoEntity, restauranteDto);
    return await this.restauranteService.create(restaurante);
  }

  @Put(':restauranteId')
  @Roles(Role.ADMIN, Role.USERW)
  async update(@Param('restauranteId') restauranteId: string, @Body() restauranteDto: RestauranteEspecializadoDto) {
    const restaurante: RestauranteEspecializadoEntity = plainToInstance(RestauranteEspecializadoEntity, restauranteDto);
    return await this.restauranteService.update(restauranteId, restaurante);
  }

  @Delete(':restauranteId')
  @Roles(Role.ADMIN, Role.USERD)
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.delete(restauranteId);
  }
}
