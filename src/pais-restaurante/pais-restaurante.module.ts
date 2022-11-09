import { CacheModule, Module } from '@nestjs/common';
import { PaisRestauranteService } from './pais-restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { PaisRestauranteController } from './pais-restaurante.controller';

@Module({
  providers: [PaisRestauranteService],
  imports: [
    TypeOrmModule.forFeature([PaisEntity, RestauranteEspecializadoEntity]), CacheModule.register()
  ],
  controllers: [PaisRestauranteController],
})
export class PaisRestauranteModule { }
