import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaProductoCaracteristicoService } from './categoria-producto-caracteristico.service';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { CategoriaProductoCaracteristicoController } from './categoria-producto-caracteristico.controller';

@Module({
  providers: [CategoriaProductoCaracteristicoService],
  imports: [TypeOrmModule.forFeature([CategoriaEntity, ProductoCaracteristicoEntity])],
  controllers: [CategoriaProductoCaracteristicoController],
})
export class CategoriaProductoCaracteristicoModule {}
