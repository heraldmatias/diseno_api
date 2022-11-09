/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

@InputType()
export class CulturaGastronomicaDto {

   @Field()
   @IsString()
   @IsOptional()
   readonly id: string;
   
   @Field()
   @IsString()
   @IsNotEmpty()
   readonly nombre: string;

   @Field()
   @IsString()
   @IsNotEmpty()
   readonly descripcion: string;

}