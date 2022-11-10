/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';



@Injectable()
export class CategoriaProductoCaracteristicoService {
    constructor(
        @InjectRepository(CategoriaEntity)
        private readonly categoriasRepository: Repository<CategoriaEntity>,
     
        @InjectRepository(ProductoCaracteristicoEntity)
        private readonly productoRepository: Repository<ProductoCaracteristicoEntity>
    ) {}

    async addProductoCaracteristicoCategoria(categoriasId: string, productoId: string): Promise<CategoriaEntity> {
        const producto: ProductoCaracteristicoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
       
        const categorias: CategoriaEntity = await this.categoriasRepository.findOne({where: {id: categoriasId}, relations: ["productos"]}) 
        if (!categorias)
          throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND);
     
        categorias.productos = [...categorias.productos, producto];
        return await this.categoriasRepository.save(categorias);
      }
     
    async findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId(categoriasId: string, productoId: string): Promise<ProductoCaracteristicoEntity> {
        const producto: ProductoCaracteristicoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
        
        const categorias: CategoriaEntity = await this.categoriasRepository.findOne({where: {id: categoriasId}, relations: ["productos"]}); 
        if (!categorias)
          throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
    
        const categoriasProductoCaracteristico: ProductoCaracteristicoEntity = categorias.productos.find(e => e.id === producto.id);
    
        if (!categoriasProductoCaracteristico)
          throw new BusinessLogicException("The producto with the given id is not associated to the categoria", BusinessError.PRECONDITION_FAILED)
    
        return categoriasProductoCaracteristico;
    }
     
    async findProductoCaracteristicosByCategoriaId(categoriasId: string): Promise<ProductoCaracteristicoEntity[]> {
        const categorias: CategoriaEntity = await this.categoriasRepository.findOne({where: {id: categoriasId}, relations: ["productos"]});
        if (!categorias)
          throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
        
        return categorias.productos;
    }
     
    async associateProductoCaracteristicosCategoria(categoriasId: string, productos: ProductoCaracteristicoEntity[]): Promise<CategoriaEntity> {
        const categorias: CategoriaEntity = await this.categoriasRepository.findOne({where: {id: categoriasId}, relations: ["productos"]});
     
        if (!categorias)
          throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
     
        for (const product of productos) {
          const producto: ProductoCaracteristicoEntity = await this.productoRepository.findOne({where: {id: product.id}});
          if (!producto)
            throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        categorias.productos = productos;
        return await this.categoriasRepository.save(categorias);
      }
     
    async deleteProductoCaracteristicoCategoria(categoriasId: string, productoId: string){
        const producto: ProductoCaracteristicoEntity = await this.productoRepository.findOne({where: {id: productoId}});
        if (!producto)
          throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND)
     
        const categorias: CategoriaEntity = await this.categoriasRepository.findOne({where: {id: categoriasId}, relations: ["productos"]});
        if (!categorias)
          throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
     
        const categoriasProductoCaracteristico: ProductoCaracteristicoEntity = categorias.productos.find(e => e.id === producto.id);
     
        if (!categoriasProductoCaracteristico)
            throw new BusinessLogicException("The producto with the given id is not associated to the categoria", BusinessError.PRECONDITION_FAILED)

        categorias.productos = categorias.productos.filter(e => e.id !== productoId);
        await this.categoriasRepository.save(categorias);
    }   
}