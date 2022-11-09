/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/role.enum';
import { Roles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@UseGuards(JwtAuthGuard)
@Controller('culturas-gastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaGastronomicaController {
    constructor(private readonly culturaGService: CulturaGastronomicaService) {}

    @Get()
    @Roles(Role.ADMIN, Role.READALL, Role.READ)
    async findAll() {
        return await this.culturaGService.findAll();
    }

    @Get(':culturaGId')
    @Roles(Role.ADMIN, Role.READALL, Role.READ)
    async findOne(@Param('culturaGId') culturaGId: string) {
        return await this.culturaGService.findOne(culturaGId);
    }

    @Post()
    @Roles(Role.ADMIN, Role.USERW)
    async create(@Body() restauranteDto: CulturaGastronomicaDto) {
        const restaurante: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, restauranteDto);
        return await this.culturaGService.create(restaurante);
    }

    @Put(':culturaGId')
    @Roles(Role.ADMIN, Role.USERW)
    async update(@Param('culturaGId') culturaGId: string, @Body() restauranteDto: CulturaGastronomicaDto) {
        const restaurante: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, restauranteDto);
        return await this.culturaGService.update(culturaGId, restaurante);
    }

    @Delete(':culturaGId')
    @Roles(Role.ADMIN, Role.USERD)
    @HttpCode(204)
    async delete(@Param('culturaGId') culturaGId: string) {
        return await this.culturaGService.delete(culturaGId);
    }
}
