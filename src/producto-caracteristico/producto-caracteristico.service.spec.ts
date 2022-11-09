import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoCaracteristicoEntity } from './producto-caracteristico.entity';
import { ProductoCaracteristicoService } from './producto-caracteristico.service';
import { faker } from '@faker-js/faker';

describe('ProductoCaracteristicoService', () => {
  let service: ProductoCaracteristicoService;
  let repository: Repository<ProductoCaracteristicoEntity>;
  let productsList: ProductoCaracteristicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoCaracteristicoService],
    }).compile();

    service = module.get<ProductoCaracteristicoService>(ProductoCaracteristicoService);
    repository = module.get<Repository<ProductoCaracteristicoEntity>>(getRepositoryToken(ProductoCaracteristicoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for(let i = 0; i < 5; i++){
        const product: ProductoCaracteristicoEntity = await repository.save({
        nombre: faker.company.name(), 
        descripcion: faker.lorem.sentence(), 
        historia: faker.address.secondaryAddress()})
        productsList.push(product);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductoCaracteristicoEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProductoCaracteristico: ProductoCaracteristicoEntity = productsList[0];
    const product: ProductoCaracteristicoEntity = await service.findOne(storedProductoCaracteristico.id);
    expect(product).not.toBeNull();
    expect(product.nombre).toEqual(storedProductoCaracteristico.nombre)
    expect(product.descripcion).toEqual(storedProductoCaracteristico.descripcion)
    expect(product.historia).toEqual(storedProductoCaracteristico.historia)
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('create should return a new product', async () => {
    const product: ProductoCaracteristicoEntity = {
      id: "",
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(), 
      historia: faker.lorem.sentence(), 
      categoria: null,
      //artworks: []
    }

    const newProductoCaracteristico: ProductoCaracteristicoEntity = await service.create(product);
    expect(newProductoCaracteristico).not.toBeNull();

    const storedProductoCaracteristico: ProductoCaracteristicoEntity = await repository.findOne({where: {id: newProductoCaracteristico.id}})
    expect(storedProductoCaracteristico).not.toBeNull();
    expect(storedProductoCaracteristico.nombre).toEqual(newProductoCaracteristico.nombre)
    expect(storedProductoCaracteristico.descripcion).toEqual(newProductoCaracteristico.descripcion)
    expect(storedProductoCaracteristico.historia).toEqual(newProductoCaracteristico.historia)
  });

  it('update should modify a product', async () => {
    const product: ProductoCaracteristicoEntity = productsList[0];
    product.nombre = "New name";
    product.descripcion = "New descripcion";
  
    const updatedProductoCaracteristico: ProductoCaracteristicoEntity = await service.update(product.id, product);
    expect(updatedProductoCaracteristico).not.toBeNull();
  
    const storedProductoCaracteristico: ProductoCaracteristicoEntity = await repository.findOne({ where: { id: product.id } })
    expect(storedProductoCaracteristico).not.toBeNull();
    expect(storedProductoCaracteristico.nombre).toEqual(product.nombre)
    expect(storedProductoCaracteristico.descripcion).toEqual(product.descripcion)
  });
 
  it('update should throw an exception for an invalid product', async () => {
    let product: ProductoCaracteristicoEntity = productsList[0];
    product = {
      ...product, nombre: "New name", descripcion: "New descripcion"
    }
    await expect(() => service.update("0", product)).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('delete should remove a product', async () => {
    const product: ProductoCaracteristicoEntity = productsList[0];
    await service.delete(product.id);
  
    const deletedProductoCaracteristico: ProductoCaracteristicoEntity = await repository.findOne({ where: { id: product.id } })
    expect(deletedProductoCaracteristico).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: ProductoCaracteristicoEntity = productsList[0];
    await service.delete(product.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The product with the given id was not found")
  });
 
});
