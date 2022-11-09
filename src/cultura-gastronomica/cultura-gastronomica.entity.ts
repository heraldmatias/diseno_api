/* eslint-disable prettier/prettier */
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(type => [RestauranteEspecializadoEntity])
  @ManyToMany(() => RestauranteEspecializadoEntity, (restaurante) => restaurante.culturasGastronomicas)
  restaurantesEspecializados: RestauranteEspecializadoEntity[];


   @ManyToMany(() => PaisEntity, paisEntity => paisEntity.culturasGastronomicas)
   @JoinTable()
   paises: PaisEntity[];

  //   @ManyToOne(() => RecetaEntity, recetaEntity => receta.culturasGastronomicas)
  //   @JoinColumn()
  //   recetas: recetaEntity[];

   @OneToMany(() => RecetaEntity, receta => receta.culturaGastronomica)
   recetas: RecetaEntity[];

//   @ManyToMany(() => ProductoCaracteristicoEntity, productoCaracteristicoEntity => productosCaracteristicos.culturasGastronomicas)
//   @JoinColumn()
//   productosCaracteristicos: productoCaracteristicoEntity[];

}
