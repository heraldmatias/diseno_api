import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoriaEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    nombre: string;

    @Field(type => [ProductoCaracteristicoEntity])
    @OneToMany(() => ProductoCaracteristicoEntity, producto => producto.categoria)
    productos: ProductoCaracteristicoEntity[];



}
