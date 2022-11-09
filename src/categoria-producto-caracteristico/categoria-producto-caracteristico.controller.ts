/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { ProductoCaracteristicoDto } from '../producto-caracteristico/producto-caracteristico.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaProductoCaracteristicoService } from './categoria-producto-caracteristico.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaProductoCaracteristicoController {
    constructor(private readonly categoriaProductoCaracteristicoService: CategoriaProductoCaracteristicoService){}

    @Post(':categoriaId/productocaracteristico/:productoCaracteristicoId')
    @Roles(Role.ADMIN, Role.USERW)
    async addProductoCaracteristicoCategoria(@Param('categoriaId') categoriaId: string, @Param('productoCaracteristicoId') productoCaracteristicoId: string){
        return await this.categoriaProductoCaracteristicoService.addProductoCaracteristicoCategoria(categoriaId, productoCaracteristicoId);
    }

    @Get(':categoriaId/productocaracteristico/:productoCaracteristicoId')
    @Roles(Role.ADMIN, Role.READALL)
    async findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId(@Param('categoriaId') categoriaId: string, @Param('productoCaracteristicoId') productoCaracteristicoId: string){
        return await this.categoriaProductoCaracteristicoService.findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId(categoriaId, productoCaracteristicoId);
    }

    @Get(':categoriaId/productocaracteristico')
    @Roles(Role.ADMIN, Role.READALL)
    async findProductoCaracteristicosByCategoriaId(@Param('categoriaId') categoriaId: string){
        return await this.categoriaProductoCaracteristicoService.findProductoCaracteristicosByCategoriaId(categoriaId);
    }

    @Put(':categoriaId/productocaracteristico')
    @Roles(Role.ADMIN, Role.USERW)
    async associateProductoCaracteristicosCategoria(@Body() productocaracteristicoDto: ProductoCaracteristicoDto[], @Param('categoriaId') categoriaId: string){
        const productocaracteristico = plainToInstance(ProductoCaracteristicoEntity, productocaracteristicoDto)
        return await this.categoriaProductoCaracteristicoService.associateProductoCaracteristicosCategoria(categoriaId, productocaracteristico);
    }
    
    @Delete(':categoriaId/productocaracteristico/:productoCaracteristicoId')
    @Roles(Role.ADMIN, Role.USERD)
    @HttpCode(204)
    async deleteProductoCaracteristicoCategoria(@Param('categoriaId') categoriaId: string, @Param('productoCaracteristicoId') productoCaracteristicoId: string){
        return await this.categoriaProductoCaracteristicoService.deleteProductoCaracteristicoCategoria(categoriaId, productoCaracteristicoId);
    }
}
