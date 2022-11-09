/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteEspecializadoCulturaGastronomicaService {

  cacheIdKey = "id_restaurante"
  cacheKey = "culturas";

  constructor(
    @InjectRepository(RestauranteEspecializadoEntity)
    private readonly restauranteRepository: Repository<RestauranteEspecializadoEntity>,

    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaRepository: Repository<CulturaGastronomicaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async addCulturaRestaurante(restauranteId: string, culturaId: string): Promise<RestauranteEspecializadoEntity> {
    const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
    if (!cultura)
      throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND);
  
    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]})
    if (!restaurante)
      throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND);

    restaurante.culturasGastronomicas = [...restaurante.culturasGastronomicas, cultura];
    return await this.restauranteRepository.save(restaurante);
  }

  async findCulturaByRestauranteIdCulturaId(restauranteId: string, culturaId: string): Promise<CulturaGastronomicaEntity> {
    const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
    if (!cultura)
      throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND)
   
    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});
    if (!restaurante)
      throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)

    const restauranteCultura: CulturaGastronomicaEntity = restaurante.culturasGastronomicas.find(c => c.id === cultura.id);

    if (!restauranteCultura)
      throw new BusinessLogicException("La cultura gastronomica con el id dado no está asociada al restaurante", BusinessError.PRECONDITION_FAILED)

    return restauranteCultura;
  }

  async findCulturasByRestauranteId(restauranteId: string): Promise<CulturaGastronomicaEntity[]> {
    const id_cached: string = await this.cacheManager.get<string>(this.cacheIdKey);
    if (!id_cached) {
      return this.getCulturas(restauranteId);
    }
    if (id_cached === restauranteId) {
      const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
      if (!cached) {
        return this.getCulturas(restauranteId);
      }
      return cached;
    } else {
      return this.getCulturas(restauranteId);
    }
  }

  async getCulturas(restauranteId: string): Promise<CulturaGastronomicaEntity[]> {
    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});
    if (!restaurante)
      throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    await this.cacheManager.set(this.cacheIdKey, restauranteId);
    await this.cacheManager.set(this.cacheKey, restaurante.culturasGastronomicas);
    return restaurante.culturasGastronomicas;
  }

  async associateCulturasRestaurante(restauranteId: string, culturas: CulturaGastronomicaEntity[]): Promise<RestauranteEspecializadoEntity> {
    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});

    if (!restaurante)
      throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)

    for (let i = 0; i < culturas.length; i++) {
      const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturas[i].id}});
      if (!cultura)
        throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND)
    }

    restaurante.culturasGastronomicas = culturas;
    return await this.restauranteRepository.save(restaurante);
  }

  async deleteCulturaRestaurante(restauranteId: string, culturaId: string){
    const cultura: CulturaGastronomicaEntity = await this.culturaRepository.findOne({where: {id: culturaId}});
    if (!cultura)
      throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND)

    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where: {id: restauranteId}, relations: ["culturasGastronomicas"]});
    if (!restaurante)
      throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)

    const restauranteCultura: CulturaGastronomicaEntity = restaurante.culturasGastronomicas.find(c => c.id === cultura.id);

    if (!restauranteCultura)
        throw new BusinessLogicException("La cultura gastronomica con el id dado no está asociada al restaurante", BusinessError.PRECONDITION_FAILED)

    restaurante.culturasGastronomicas = restaurante.culturasGastronomicas.filter(c => c.id !== culturaId);
    await this.restauranteRepository.save(restaurante);
  }
}
