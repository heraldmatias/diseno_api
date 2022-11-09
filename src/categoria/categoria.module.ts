import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { CategoriaResolver } from './categoria.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  providers: [CategoriaService, CategoriaResolver],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
