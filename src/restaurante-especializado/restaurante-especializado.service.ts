/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEspecializadoEntity } from './restaurante-especializado.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteEspecializadoService {

  cacheKey = "restaurantes";

  constructor(
    @InjectRepository(RestauranteEspecializadoEntity)
    private readonly restauranteRepository: Repository<RestauranteEspecializadoEntity>,
    
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async findAll(): Promise<RestauranteEspecializadoEntity[]> {
    const cached: RestauranteEspecializadoEntity[] = await this.cacheManager.get<RestauranteEspecializadoEntity[]>(this.cacheKey);

    if (!cached){
      const restaurantes: RestauranteEspecializadoEntity[] = await this.restauranteRepository.find();
      await this.cacheManager.set(this.cacheKey, restaurantes)
      return restaurantes;
    }

    return cached;
  }

  async findOne(id: string): Promise<RestauranteEspecializadoEntity> {
    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where:{id}, relations: ["culturasGastronomicas"]});
    if (!restaurante)
      throw new BusinessLogicException('El restaurante con el id dado no fue encontrado', BusinessError.NOT_FOUND,);

    return restaurante;
  }

  async create(restaurante: RestauranteEspecializadoEntity): Promise<RestauranteEspecializadoEntity> {
    return await this.restauranteRepository.save(restaurante);
  }

  async update(id: string, restaurante: RestauranteEspecializadoEntity): Promise<RestauranteEspecializadoEntity> {
    const persistedRestaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where:{id}});
    if (!persistedRestaurante)
      throw new BusinessLogicException("El restaurante con el id dado no fue encontrado", BusinessError.NOT_FOUND);

    return await this.restauranteRepository.save({...persistedRestaurante, ...restaurante});
  }

  async delete(id: string) {
    const restaurante: RestauranteEspecializadoEntity = await this.restauranteRepository.findOne({where:{id}});
    if (!restaurante)
      throw new BusinessLogicException("El restaurante con el id dado no fue encontrado", BusinessError.NOT_FOUND);

    await this.restauranteRepository.remove(restaurante);
  }
}
