/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaRestauranteEspecializadoService {
    cacheIdKey = "id_culturas"
    cacheKey = "restaurantesC";
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    
        @InjectRepository(RestauranteEspecializadoEntity)
        private readonly restauranteEspecializadoRepository: Repository<RestauranteEspecializadoEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    

    async addRestauranteEspecializadoCulturaGastronomica(culturaGastronomicaId: string, restauranteEspecializadoId: string): Promise<CulturaGastronomicaEntity> {
        const restauranteEspecializado: RestauranteEspecializadoEntity = await this.restauranteEspecializadoRepository.findOne({where: {id: restauranteEspecializadoId}});
        if (!restauranteEspecializado)
          throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND);
  
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}, relations: ["restaurantesEspecializados"]});
        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND);

        culturaGastronomica.restaurantesEspecializados = [...culturaGastronomica.restaurantesEspecializados, restauranteEspecializado];
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
      }
     
    async findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId(culturaGastronomicaId: string, restauranteEspecializadoId: string): Promise<RestauranteEspecializadoEntity> {
        const restauranteEspecializado: RestauranteEspecializadoEntity = await this.restauranteEspecializadoRepository.findOne({where: {id: restauranteEspecializadoId}});
        if (!restauranteEspecializado)
          throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)
        
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}, relations: ["restaurantesEspecializados"]}); 
        if (!culturaGastronomica)
          throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado. Make sure your query is correct.", BusinessError.NOT_FOUND)
    
        const culturaGastronomicaRestauranteEspecializado: RestauranteEspecializadoEntity = culturaGastronomica.restaurantesEspecializados.find(e => e.id === restauranteEspecializado.id);
    
        if (!culturaGastronomicaRestauranteEspecializado)
          throw new BusinessLogicException("El restaurante con el id dado no fue encontrado", BusinessError.PRECONDITION_FAILED)
    
        return culturaGastronomicaRestauranteEspecializado;
    }
     
    async findRestaurantesEspecializadosByCulturaGastronomicaId(culturaGastronomicaId: string): Promise<RestauranteEspecializadoEntity[]> {
      const id_cached: string = await this.cacheManager.get<string>(this.cacheIdKey);
      if (!id_cached) {
        return this.getRestaurantes(culturaGastronomicaId);
      }
      if (id_cached === culturaGastronomicaId) {
        const cached: RestauranteEspecializadoEntity[] = await this.cacheManager.get<RestauranteEspecializadoEntity[]>(this.cacheKey);
        if (!cached) {
          return this.getRestaurantes(culturaGastronomicaId);
        }
        return cached;
      } else {
        return this.getRestaurantes(culturaGastronomicaId);
      }
      
      
    }
     
    async associateRestauranteEspecializadosCulturaGastronomica(culturaGastronomicaId: string, restaurantesEspecializados: RestauranteEspecializadoEntity[]): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}, relations: ["restaurantesEspecializados"]});
     
        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND)
     
        for (const restaurant of restaurantesEspecializados) {
          const restauranteEspecializado: RestauranteEspecializadoEntity = await this.restauranteEspecializadoRepository.findOne({where: {id: restaurant.id}});
          if (!restauranteEspecializado)
            throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)
        }
     
        culturaGastronomica.restaurantesEspecializados = restaurantesEspecializados;
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
      }
     
    async deleteRestauranteEspecializadoCulturaGastronomica(culturaGastronomicaId: string, restauranteEspecializadoId: string){
        const restauranteEspecializado: RestauranteEspecializadoEntity = await this.restauranteEspecializadoRepository.findOne({where: {id: restauranteEspecializadoId}});
        if (!restauranteEspecializado)
          throw new BusinessLogicException("El restaurante especializado con el id dado no fue encontrado", BusinessError.NOT_FOUND)
     
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaGastronomicaId}, relations: ["restaurantesEspecializados"]});
        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND)
     
        const culturaGastronomicaRestauranteEspecializado: RestauranteEspecializadoEntity = culturaGastronomica.restaurantesEspecializados.find(e => e.id === restauranteEspecializado.id);
     
        if (!culturaGastronomicaRestauranteEspecializado)
            throw new BusinessLogicException("El restaurante con el id dado no fue encontrado", BusinessError.PRECONDITION_FAILED)

        culturaGastronomica.restaurantesEspecializados = culturaGastronomica.restaurantesEspecializados.filter(e => e.id !== restauranteEspecializadoId);
        await this.culturaGastronomicaRepository.save(culturaGastronomica);
    } 

    async getRestaurantes(culturaId: string): Promise<RestauranteEspecializadoEntity[]> {
      const culturas: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: culturaId}, relations: []});
      if (!culturas)
        throw new BusinessLogicException("La cultura gastronomica con el id dado no fue encontrada", BusinessError.NOT_FOUND)
  
      await this.cacheManager.set(this.cacheIdKey, culturaId);
      await this.cacheManager.set(this.cacheKey, culturas.restaurantesEspecializados);
      return culturas.restaurantesEspecializados;
    }
}
