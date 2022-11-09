/* eslint-disable prettier/prettier */
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Column, Entity, ManyToOne, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEspecializadoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  ciudad: string;

  @ManyToOne(() => PaisEntity, pais => pais.restaurantesEspecializados)
  pais: PaisEntity;

  //   @OneToMany(() => EstrellaMichelinEntity, estrellaMichelin => estrellaMichelin.restauranteEspecializado)
  //   estrellasMichelin: EstrellaMichelinEntity[];

  @Field(type => [CulturaGastronomicaEntity])
  @ManyToMany(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.restaurantesEspecializados)
  @JoinTable()
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
