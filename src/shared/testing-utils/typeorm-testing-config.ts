/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoCaracteristicoEntity } from '../../producto-caracteristico/producto-caracteristico.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { CategoriaEntity } from '../../categoria/categoria.entity';
import { RestauranteEspecializadoEntity } from '../../restaurante-especializado/restaurante-especializado.entity';


export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductoCaracteristicoEntity, PaisEntity, RecetaEntity, RestauranteEspecializadoEntity,CategoriaEntity, CulturaGastronomicaEntity],
    synchronize: true,
    keepConnectionAlive: true
}),
  TypeOrmModule.forFeature([ProductoCaracteristicoEntity, PaisEntity, RecetaEntity, RestauranteEspecializadoEntity,CategoriaEntity, CulturaGastronomicaEntity]),
];
