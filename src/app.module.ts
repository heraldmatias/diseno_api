/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoCaracteristicoModule } from './producto-caracteristico/producto-caracteristico.module';
import { RecetaModule } from './receta/receta.module';
import { PaisModule } from './pais/pais.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaModule } from './cultura-gastronomica/cultura-gastronomica.module';
import { CategoriaModule } from './categoria/categoria.module';
import { RestauranteEspecializadoModule } from './restaurante-especializado/restaurante-especializado.module';
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
    TypeOrmModule.forRoot(), // configuration will be passed with a ormconfig.json or .env file
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
