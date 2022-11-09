import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  BusinessError,  BusinessLogicException,} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';

@Injectable()
export class ProductoCaracteristicoService {
  constructor(
    @InjectRepository(ProductoCaracteristicoEntity)
    private readonly productoCaracteristicoRepository: Repository<ProductoCaracteristicoEntity>,
  ) {}

  async findAll(): Promise<ProductoCaracteristicoEntity[]> {
    return await this.productoCaracteristicoRepository.find();
  }

  async findOne(id: string): Promise<ProductoCaracteristicoEntity> {
    const product: ProductoCaracteristicoEntity =
      await this.productoCaracteristicoRepository.findOne({ where: { id } });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return product;
  }

  async create(
    product: ProductoCaracteristicoEntity,
  ): Promise<ProductoCaracteristicoEntity> {
    return await this.productoCaracteristicoRepository.save(product);
  }

  async update(
    id: string,
    product: ProductoCaracteristicoEntity,
  ): Promise<ProductoCaracteristicoEntity> {
    const persistedProduct: ProductoCaracteristicoEntity =
      await this.productoCaracteristicoRepository.findOne({ where: { id } });
    if (!persistedProduct)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.productoCaracteristicoRepository.save({
      ...persistedProduct,
      ...product,
    });
  }

  async delete(id: string) {
    const product: ProductoCaracteristicoEntity =
      await this.productoCaracteristicoRepository.findOne({
        where: { id },
      });
    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.productoCaracteristicoRepository.remove(product);
  }
}
