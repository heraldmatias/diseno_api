import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './categoria.entity';

@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(CategoriaEntity)
        private readonly categoriaRepository: Repository<CategoriaEntity>
    ){}

    async findAll(): Promise<CategoriaEntity[]> {
        return await this.categoriaRepository.find();
    }

    async findOne(id: string): Promise<CategoriaEntity> {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id}});
        if (!categoria)
          throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
    
        return categoria;
    }
    
    async create(categoria: CategoriaEntity): Promise<CategoriaEntity> {
        return await this.categoriaRepository.save(categoria);
    }

    async update(id: string, categoria: CategoriaEntity): Promise<CategoriaEntity> {
        const persistedCategoria: CategoriaEntity = await this.categoriaRepository.findOne({where:{id}});
        if (!persistedCategoria)
          throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
        
        return await this.categoriaRepository.save({...persistedCategoria, ...categoria});
    }

    async delete(id: string) {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where:{id}});
        if (!categoria)
          throw new BusinessLogicException("The category with the given id was not found", BusinessError.NOT_FOUND);
      
        await this.categoriaRepository.remove(categoria);
    }
}