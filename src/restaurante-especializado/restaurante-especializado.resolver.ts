/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RestauranteEspecializadoDto } from './restaurante-especializado.dto';
import { RestauranteEspecializadoEntity } from './restaurante-especializado.entity';
import { RestauranteEspecializadoService } from './restaurante-especializado.service';

@Resolver()
export class RestauranteEspecializadoResolver {
    constructor(private restauranteService: RestauranteEspecializadoService) {}

    @Query(() => [RestauranteEspecializadoEntity])
    restaurantes(): Promise<RestauranteEspecializadoEntity[]> {
        return this.restauranteService.findAll();
    }

    @Query(() => RestauranteEspecializadoEntity)
    restaurante(@Args('id') id: string): Promise<RestauranteEspecializadoEntity> {
        return this.restauranteService.findOne(id);
    }

    @Mutation(() => RestauranteEspecializadoEntity)
    createRestaurante(@Args('restaurante') restauranteDto: RestauranteEspecializadoDto): Promise<RestauranteEspecializadoEntity> {
        const restaurante = plainToInstance(RestauranteEspecializadoEntity, restauranteDto);
        return this.restauranteService.create(restaurante)
    }

    @Mutation(() => RestauranteEspecializadoEntity)
    updateRestaurante(@Args('id') id: string, @Args('restaurante') restauranteDto: RestauranteEspecializadoDto): Promise<RestauranteEspecializadoEntity> {
        const restaurante = plainToInstance(RestauranteEspecializadoEntity, restauranteDto);
        return this.restauranteService.update(id, restaurante)
    }

    @Mutation(() => String)
    deleteRestaurante(@Args('id') id: string) {
        this.restauranteService.delete(id);
        return id;
    }
}
