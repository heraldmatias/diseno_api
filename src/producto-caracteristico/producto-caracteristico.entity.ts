/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class ProductoCaracteristicoEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  historia: string;

  @Field(type => CategoriaEntity)
  @ManyToOne(() => CategoriaEntity, categoria => categoria.productos)
    categoria: CategoriaEntity;
}
