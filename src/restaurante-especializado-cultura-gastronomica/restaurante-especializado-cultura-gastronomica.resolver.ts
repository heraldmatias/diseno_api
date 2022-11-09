/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from '../cultura-gastronomica/cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { RestauranteEspecializadoCulturaGastronomicaService } from './restaurante-especializado-cultura-gastronomica.service';

@Resolver()
export class RestauranteEspecializadoCulturaGastronomicaResolver {
    constructor(private restauranteCulturaService: RestauranteEspecializadoCulturaGastronomicaService) {}

    @Query(() => CulturaGastronomicaEntity)
    culturaByRestaurante(@Args('idRestaurante') idRestaurante: string, @Args('idCultura') idCultura: string): Promise<CulturaGastronomicaEntity> {
        return this.restauranteCulturaService.findCulturaByRestauranteIdCulturaId(idRestaurante, idCultura);
    }

    @Query(() => [CulturaGastronomicaEntity])
    culturasByRestaurante(@Args('idRestaurante') idRestaurante: string): Promise<CulturaGastronomicaEntity[]> {
        return this.restauranteCulturaService.findCulturasByRestauranteId(idRestaurante);
    }

    @Mutation(() => RestauranteEspecializadoEntity)
    addCulturaRestaurante(@Args('idRestaurante') idRestaurante: string, @Args('idCultura') idCultura: string): Promise<RestauranteEspecializadoEntity> {
        return this.restauranteCulturaService.addCulturaRestaurante(idRestaurante, idCultura);
    }

    @Mutation(() => RestauranteEspecializadoEntity)
    associateCulturasRestaurante(@Args('idRestaurante') idRestaurante: string, @Args({ name: 'culturasGastronomicas', type: () => [CulturaGastronomicaDto]}) culturasDto: CulturaGastronomicaDto[]): Promise<RestauranteEspecializadoEntity> {
        const culturas = plainToInstance(CulturaGastronomicaEntity, culturasDto);
        return this.restauranteCulturaService.associateCulturasRestaurante(idRestaurante, culturas);
    }

    @Mutation(() => String)
    deleteCulturaRestaurante(@Args('idRestaurante') idRestaurante: string, @Args('idCultura') idCultura: string) {
        this.restauranteCulturaService.deleteCulturaRestaurante(idRestaurante, idCultura);
        return idCultura;
    }
}
