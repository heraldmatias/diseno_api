import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(type => [CulturaGastronomicaEntity])
  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.paises,
  )
  culturasGastronomicas: CulturaGastronomicaEntity[];

  @Field(type => [RestauranteEspecializadoEntity])
  @OneToMany(() => RestauranteEspecializadoEntity, restauranteEspecializado => restauranteEspecializado.pais)
  restaurantesEspecializados: RestauranteEspecializadoEntity[];
}
