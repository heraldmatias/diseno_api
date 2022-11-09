/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestauranteEspecializadoDto } from '../restaurante-especializado/restaurante-especializado.dto';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisRestauranteService } from './pais-restaurante.service';

@UseGuards(JwtAuthGuard)
@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisRestauranteController {
    constructor(private readonly paisRestauranteService: PaisRestauranteService) { }

    @Post(':paisId/restaurantesEspecializados/:restauranteId')
    @Roles(Role.ADMIN, Role.USERW)
    async addRestaurantePais(@Param('paisId') paisId: string, @Param('restauranteId') restauranteId: string) {
        return await this.paisRestauranteService.addRestaurantePais(paisId, restauranteId);
    }

    @Get(':paisId/restaurantesEspecializados/:restauranteId')
    @Roles(Role.ADMIN, Role.READALL)
    async findRestauranteByPaisIdRestauranteId(@Param('paisId') paisId: string, @Param('restauranteId') restauranteId: string) {
        return await this.paisRestauranteService.findRestauranteByPaisIdRestauranteId(paisId, restauranteId);
    }

    @Get(':paisId/restaurantesEspecializados')
    @Roles(Role.ADMIN, Role.READALL)
    async findRestaurantesByPaisId(@Param('paisId') paisId: string) {
        return await this.paisRestauranteService.findRestaurantesByPaisId(paisId);
    }

     @Put(':paisId/restaurantesEspecializados')
     @Roles(Role.ADMIN, Role.USERW)
     async associateRestaurantesPais(@Body() restaurantesDto: RestauranteEspecializadoDto[], @Param('paisId') paisId: string) {
         const restaurantes = plainToInstance(RestauranteEspecializadoEntity, restaurantesDto)
         return await this.paisRestauranteService.associateRestaurantesPais(paisId, restaurantes);
     }

    @Delete(':paisId/restaurantesEspecializados/:restauranteId')
    @Roles(Role.ADMIN, Role.USERD)
    @HttpCode(204)
    async deleteRestaurantePais(@Param('paisId') paisId: string, @Param('restauranteId') restauranteId: string) {
        return await this.paisRestauranteService.deleteRestaurantePais(paisId, restauranteId);
    }
}
