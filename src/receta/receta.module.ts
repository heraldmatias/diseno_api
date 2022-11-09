import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';

@Module({
  providers: [RecetaService],
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
})
export class RecetaModule {}
