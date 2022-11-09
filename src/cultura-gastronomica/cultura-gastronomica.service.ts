import { CACHE_MANAGER, Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';

@Injectable()
export class CulturaGastronomicaService {

    cacheKey: string = "culturasGastronomicas";

    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<CulturaGastronomicaEntity[]> {
        const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
      
        if(!cached){
            const culturas: CulturaGastronomicaEntity[] = await this.culturaGastronomicaRepository.find({ 
                //relations: ["paises", "recetas", "productosCaracteristicos", "restaurantesEspecializados"] 
            });
            await this.cacheManager.set(this.cacheKey, culturas);
            return culturas;
        }

        return cached;
    }

    async findOne(id: string): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({
            where: {id} //, relations: ["paises", "recetas", "productosCaracteristicos", "restaurantesEspecializados"] 
        } );
        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id indicado no fue encontrado", BusinessError.NOT_FOUND);
    
        return culturaGastronomica;
    }
    
    async create(culturaGastronomica: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }

    async update(id: string, culturaGastronomica: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        const persistedCulturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
        if (!persistedCulturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id indicado no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.culturaGastronomicaRepository.save({...persistedCulturaGastronomica, ...culturaGastronomica});
    }

    async delete(id: string) {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronomica con el id indicado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.culturaGastronomicaRepository.remove(culturaGastronomica);
    }
}
