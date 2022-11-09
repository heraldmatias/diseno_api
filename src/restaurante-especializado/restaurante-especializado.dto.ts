/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsString} from 'class-validator';

@InputType()
export class RestauranteEspecializadoDto {

 @Field()
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @Field()
 @IsString()
 @IsNotEmpty()
 readonly ciudad: string;

}