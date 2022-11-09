/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
    constructor(private readonly paisService: PaisService) { }

    @Get()
    @Roles(Role.ADMIN, Role.READALL)
    async findAll() {
        return await this.paisService.findAll();
    }

    @Get(':paisId')
    @Roles(Role.ADMIN, Role.READALL)
    async findOne(@Param('paisId') paisId: string) {
        return await this.paisService.findOne(paisId);
    }

    @Post()
    @Roles(Role.ADMIN, Role.USERW)
    async create(@Body() paisDto: PaisDto) {
        const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
        return await this.paisService.create(pais);
    }

    @Put(':paisId')
    @Roles(Role.ADMIN, Role.USERW)
    async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
        const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
        return await this.paisService.update(paisId, pais);
    }

    @Delete(':paisId')
    @Roles(Role.ADMIN, Role.USERD)
    @HttpCode(204)
    async delete(@Param('paisId') paisId: string) {
        return await this.paisService.delete(paisId);
    }
}
