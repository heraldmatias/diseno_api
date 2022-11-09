/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoCaracteristicoEntity } from './producto-caracteristico/producto-caracteristico.entity';
import { ProductoCaracteristicoModule } from './producto-caracteristico/producto-caracteristico.module';
import { RecetaModule } from './receta/receta.module';
import { RecetaEntity } from './receta/receta.entity';
import { PaisModule } from './pais/pais.module';
import { PaisEntity } from './pais/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaModule } from './cultura-gastronomica/cultura-gastronomica.module';
import { CulturaGastronomicaEntity } from './cultura-gastronomica/cultura-gastronomica.entity';
import { CategoriaModule } from './categoria/categoria.module';
import { CategoriaEntity } from './categoria/categoria.entity';
import { RestauranteEspecializadoModule } from './restaurante-especializado/restaurante-especializado.module';
import { RestauranteEspecializadoEntity } from './restaurante-especializado/restaurante-especializado.entity';
import { CategoriaProductoCaracteristicoModule } from './categoria-producto-caracteristico/categoria-producto-caracteristico.module';
import { RestauranteEspecializadoCulturaGastronomicaModule } from './restaurante-especializado-cultura-gastronomica/restaurante-especializado-cultura-gastronomica.module';
import { PaisRestauranteModule } from './pais-restaurante/pais-restaurante.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './user/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    CategoriaModule,
    RecetaModule,
    PaisModule,
    CulturaGastronomicaModule,
    ProductoCaracteristicoModule,
    RestauranteEspecializadoModule,
    TypeOrmModule.forRoot(), // configuration will be passed with a ormconfig.json file
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),
    CategoriaProductoCaracteristicoModule,
    RestauranteEspecializadoCulturaGastronomicaModule,
    PaisRestauranteModule,
    UserModule,
    AuthModule,

    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),

  ],
  controllers: [AppController],
  providers: [AppService, JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }],
})
export class AppModule { }
