/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestauranteEspecializadoDto } from '../restaurante-especializado/restaurante-especializado.dto';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaRestauranteEspecializadoService } from './cultura-gastronomica-restaurante-especializado.service';

@UseGuards(JwtAuthGuard)
@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaRestauranteEspecializadoController {
    constructor(private readonly culturaGastronomicaRestauranteEspecializadoService: CulturaGastronomicaRestauranteEspecializadoService){}

    @Post(':culturaGId/restaurantes/:restauranteId')
    @Roles(Role.ADMIN, Role.USERW)
    async addRestauranteCultura(@Param('culturaGId') culturaGId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaGastronomicaRestauranteEspecializadoService.addRestauranteEspecializadoCulturaGastronomica(culturaGId, restauranteId);
    }

    @Get(':culturaGId/restaurantes/:restauranteId')
    @Roles(Role.ADMIN, Role.READALL)
    async findCulturaByculturaGIdCulturaId(@Param('culturaGId') culturaGId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaGastronomicaRestauranteEspecializadoService.findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId(culturaGId, restauranteId);
    }

    @Get(':culturaGId/restaurantes')
    @Roles(Role.ADMIN, Role.READALL)
    async findRestaurantesByCulturaGId(@Param('culturaGId') culturaGId: string){
        return await this.culturaGastronomicaRestauranteEspecializadoService.findRestaurantesEspecializadosByCulturaGastronomicaId(culturaGId);
    }

    @Put(':culturaGId/restaurantes')
    @Roles(Role.ADMIN, Role.USERW)
    async associateRestauranteCulturas(@Body() restaurantesDto: RestauranteEspecializadoDto[], @Param('culturaGId') culturaGId: string){
        const restaurantes = plainToInstance(RestauranteEspecializadoEntity, restaurantesDto)
        return await this.culturaGastronomicaRestauranteEspecializadoService.associateRestauranteEspecializadosCulturaGastronomica(culturaGId, restaurantes);
    }

    @Delete(':culturaGId/restaurantes/:restauranteId')
    @Roles(Role.ADMIN, Role.USERD)
    @HttpCode(204)
    async deleteRestauranteCultura(@Param('culturaGId') culturaGId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaGastronomicaRestauranteEspecializadoService.deleteRestauranteEspecializadoCulturaGastronomica(culturaGId, restauranteId);
    }
}
