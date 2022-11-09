/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { RestauranteEspecializadoCulturaGastronomicaService } from './restaurante-especializado-cultura-gastronomica.service';
import { RestauranteEspecializadoCulturaGastronomicaController } from './restaurante-especializado-cultura-gastronomica.controller';
import { RestauranteEspecializadoCulturaGastronomicaResolver } from './restaurante-especializado-cultura-gastronomica.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEspecializadoEntity, CulturaGastronomicaEntity]),
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5
    },
  })
],
  providers: [RestauranteEspecializadoCulturaGastronomicaService, RestauranteEspecializadoCulturaGastronomicaResolver],
  controllers: [RestauranteEspecializadoCulturaGastronomicaController],
})
export class RestauranteEspecializadoCulturaGastronomicaModule {}
