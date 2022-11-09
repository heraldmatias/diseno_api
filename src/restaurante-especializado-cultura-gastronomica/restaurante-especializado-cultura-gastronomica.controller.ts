/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteEspecializadoCulturaGastronomicaService } from './restaurante-especializado-cultura-gastronomica.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurantesespecializados')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteEspecializadoCulturaGastronomicaController {
  constructor(private readonly restauranteCulturaService: RestauranteEspecializadoCulturaGastronomicaService){}

   @Post(':restauranteId/culturasgastronomicas/:culturaId')
   @Roles(Role.ADMIN, Role.USERW)
   async addCulturaRestaurante(@Param('restauranteId') restauranteId: string, @Param('culturaId') culturaId: string){
       return await this.restauranteCulturaService.addCulturaRestaurante(restauranteId, culturaId);
   }

   @Get(':restauranteId/culturasgastronomicas/:culturaId')
   @Roles(Role.ADMIN, Role.READALL)
   async findCulturaByRestauranteIdCulturaId(@Param('restauranteId') restauranteId: string, @Param('culturaId') culturaId: string){
       return await this.restauranteCulturaService.findCulturaByRestauranteIdCulturaId(restauranteId, culturaId);
   }

   @Get(':restauranteId/culturasgastronomicas')
   @Roles(Role.ADMIN, Role.READALL)
   async findCulturasByRestauranteId(@Param('restauranteId') restauranteId: string){
       return await this.restauranteCulturaService.findCulturasByRestauranteId(restauranteId);
   }

   @Put(':restauranteId/culturasgastronomicas')
   @Roles(Role.ADMIN, Role.USERW)
   async associateCulturasRestaurante(@Body() culturasDto: CulturaGastronomicaDto[], @Param('restauranteId') restauranteId: string){
       const culturas = plainToInstance(CulturaGastronomicaEntity, culturasDto)
       return await this.restauranteCulturaService.associateCulturasRestaurante(restauranteId, culturas);
   }

   @Delete(':restauranteId/culturasgastronomicas/:culturaId')
   @Roles(Role.ADMIN, Role.USERD)
   @HttpCode(204)
   async deleteCulturaRestaurante(@Param('restauranteId') restauranteId: string, @Param('culturaId') culturaId: string){
       return await this.restauranteCulturaService.deleteCulturaRestaurante(restauranteId, culturaId);
   }
}
