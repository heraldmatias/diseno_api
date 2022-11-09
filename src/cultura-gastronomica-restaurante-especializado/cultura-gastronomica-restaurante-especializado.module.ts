import { CACHE_MANAGER, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { CulturaGastronomicaRestauranteEspecializadoService } from './cultura-gastronomica-restaurante-especializado.service';
import { CulturaGastronomicaRestauranteEspecializadoController } from './cultura-gastronomica-restaurante-especializado.controller';
import * as sqliteStore from 'cache-manager-sqlite';


@Module({
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEspecializadoEntity]),
    CacheModule.register({
      store: sqliteStore,
      path: ':memory:',
      options: {
        ttl: 5
      },
    })
  ],
  providers: [CulturaGastronomicaRestauranteEspecializadoService],
  controllers: [CulturaGastronomicaRestauranteEspecializadoController]
})
export class CulturaGastronomicaRestauranteEspecializadoModule {
  
}
