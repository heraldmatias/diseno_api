import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaProductoCaracteristicoService } from './categoria-producto-caracteristico.service';
import { ProductoCaracteristicoEntity } from '../producto-caracteristico/producto-caracteristico.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';



describe('CategoriaProductoCaracteristicoService', () => {
  let service: CategoriaProductoCaracteristicoService;
  let categoriaRepository: Repository<CategoriaEntity>;
  let productoRepository: Repository<ProductoCaracteristicoEntity>;
  let categoria: CategoriaEntity;
  let productosList : ProductoCaracteristicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaProductoCaracteristicoService],
    }).compile();

    service = module.get<CategoriaProductoCaracteristicoService>(CategoriaProductoCaracteristicoService);
    categoriaRepository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
    productoRepository = module.get<Repository<ProductoCaracteristicoEntity>>(getRepositoryToken(ProductoCaracteristicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    categoriaRepository.clear();

    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoCaracteristicoEntity = await productoRepository.save({
          nombre: faker.company.name(), 
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence()
        })
        productosList.push(producto);
    }

    categoria = await categoriaRepository.save({
      nombre: faker.company.name(), 
      productos: productosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCaracteristicoCategoria should add an producto to a categoria', async () => {
    const newProducto: ProductoCaracteristicoEntity = await productoRepository.save({
          nombre: faker.company.name(), 
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence()
    });

    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.company.name()
    })

    const result: CategoriaEntity = await service.addProductoCaracteristicoCategoria(newCategoria.id, newProducto.id);
    
    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre)
    expect(result.productos[0].descripcion).toBe(newProducto.descripcion)
    expect(result.productos[0].historia).toBe(newProducto.historia)
  });

  it('addProductoCaracteristicoCategoria should thrown exception for an invalid producto', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.company.name(), 
    })

    await expect(() => service.addProductoCaracteristicoCategoria(newCategoria.id, "0")).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('addProductoCaracteristicoCategoria should throw an exception for an invalid categoria', async () => {
    const newProducto: ProductoCaracteristicoEntity = await productoRepository.save({
          nombre: faker.company.name(), 
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence()
    });

    await expect(() => service.addProductoCaracteristicoCategoria("0", newProducto.id)).rejects.toHaveProperty("message", "The categoria with the given id was not found");
  });

  it('findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId should return producto by categoria', async () => {
    const producto: ProductoCaracteristicoEntity = productosList[0];
    const storedProducto: ProductoCaracteristicoEntity = await service.findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId(categoria.id, producto.id, )
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.descripcion).toBe(producto.descripcion);
    expect(storedProducto.historia).toBe(producto.historia);
  });

  it('findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId should throw an exception for an invalid producto', async () => {
    await expect(()=> service.findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId(categoria.id, "0")).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId should throw an exception for an invalid categoria', async () => {
    const producto: ProductoCaracteristicoEntity = productosList[0]; 
    await expect(()=> service.findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId("0", producto.id)).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId should throw an exception for an producto not associated to the categoria', async () => {
    const newProducto: ProductoCaracteristicoEntity = await productoRepository.save({
          nombre: faker.company.name(), 
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence()
    });

    await expect(()=> service.findProductoCaracteristicoByCategoriaIdProductoCaracteristicoId(categoria.id, newProducto.id)).rejects.toHaveProperty("message", "The producto with the given id is not associated to the categoria"); 
  });

  it('findProductoCaracteristicosByCategoriaId should return productos by categoria', async ()=>{
    const productos: ProductoCaracteristicoEntity[] = await service.findProductoCaracteristicosByCategoriaId(categoria.id);
    expect(productos.length).toBe(5)
  });

  it('findProductoCaracteristicosByCategoriaId should throw an exception for an invalid categoria', async () => {
    await expect(()=> service.findProductoCaracteristicosByCategoriaId("0")).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('associateProductoCaracteristicosCategoria should update productos list for a categoria', async () => {
    const newProducto: ProductoCaracteristicoEntity = await productoRepository.save({
          nombre: faker.company.name(), 
          descripcion: faker.lorem.sentence(),
          historia: faker.lorem.sentence()
    });

    const updatedCategoria: CategoriaEntity = await service.associateProductoCaracteristicosCategoria(categoria.id, [newProducto]);
    expect(updatedCategoria.productos.length).toBe(1);

    expect(updatedCategoria.productos[0].nombre).toBe(newProducto.nombre);
  });

  it('associateProductoCaracteristicosCategoria should throw an exception for an invalid categoria', async () => {
    const newProducto: ProductoCaracteristicoEntity = await productoRepository.save({
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    await expect(()=> service.associateProductoCaracteristicosCategoria("0", [newProducto])).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('associateProductoCaracteristicosCategoria should throw an exception for an invalid producto', async () => {
    const newProducto: ProductoCaracteristicoEntity = productosList[0];
    newProducto.id = "0";

    await expect(()=> service.associateProductoCaracteristicosCategoria(categoria.id, [newProducto])).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('deleteProductoToCategoria should remove an producto from a categoria', async () => {
    const producto: ProductoCaracteristicoEntity = productosList[0];
    
    await service.deleteProductoCaracteristicoCategoria(categoria.id, producto.id);

    const storedCategoria: CategoriaEntity = await categoriaRepository.findOne({where: {id: categoria.id}, relations: ["productos"]});
    const deletedProducto: ProductoCaracteristicoEntity = storedCategoria.productos.find(a => a.id === producto.id);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteProductoToCategoria should thrown an exception for an invalid producto', async () => {
    await expect(()=> service.deleteProductoCaracteristicoCategoria(categoria.id, "0")).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('deleteProductoToCategoria should thrown an exception for an invalid categoria', async () => {
    const producto: ProductoCaracteristicoEntity = productosList[0];
    await expect(()=> service.deleteProductoCaracteristicoCategoria("0", producto.id)).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('deleteProductoToCategoria should thrown an exception for an non asocciated producto', async () => {
    const newProducto: ProductoCaracteristicoEntity = await productoRepository.save({
      nombre: faker.company.name(), 
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence()
    });

    await expect(()=> service.deleteProductoCaracteristicoCategoria(categoria.id, newProducto.id)).rejects.toHaveProperty("message", "The producto with the given id is not associated to the categoria"); 
  }); 

});
