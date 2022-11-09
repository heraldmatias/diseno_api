/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEspecializadoEntity } from './restaurante-especializado.entity';
import { RestauranteEspecializadoService } from './restaurante-especializado.service';
import { RestauranteEspecializadoController } from './restaurante-especializado.controller';
import { RestauranteEspecializadoResolver } from './restaurante-especializado.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEspecializadoEntity]), 
  CacheModule.register({
    store: sqliteStore,
    path: ':memory:',
    options: {
      ttl: 5
    },
  })
],
  providers: [RestauranteEspecializadoService, RestauranteEspecializadoResolver],
  controllers: [RestauranteEspecializadoController],
})
export class RestauranteEspecializadoModule {}
