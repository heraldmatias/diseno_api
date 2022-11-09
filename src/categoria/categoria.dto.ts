import {IsNotEmpty, IsString} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';


@InputType()
export class CategoriaDto {
  
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
