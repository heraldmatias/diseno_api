import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: Repository<CategoriaEntity>;
  let categorysList: CategoriaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaService],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categorysList = [];
    for(let i = 0; i < 5; i++){
        const category: CategoriaEntity = await repository.save({
        nombre: faker.company.name()})
        categorysList.push(category);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categorys', async () => {
    const categorys: CategoriaEntity[] = await service.findAll();
    expect(categorys).not.toBeNull();
    expect(categorys).toHaveLength(categorysList.length);
  });

  it('findOne should return a category by id', async () => {
    const storedCategoria: CategoriaEntity = categorysList[0];
    const category: CategoriaEntity = await service.findOne(storedCategoria.id);
    expect(category).not.toBeNull();
    expect(category.nombre).toEqual(storedCategoria.nombre)
  });

  it('findOne should throw an exception for an invalid category', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The category with the given id was not found")
  });

  it('create should return a new category', async () => {
    const category: CategoriaEntity = {
      id: "",
      nombre: faker.company.name(), 
      productos: [],
      //artworks: []
    }

    const newCategoria: CategoriaEntity = await service.create(category);
    expect(newCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({where: {id: newCategoria.id}})
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(newCategoria.nombre)
  });

  it('update should modify a category', async () => {
    const category: CategoriaEntity = categorysList[0];
    category.nombre = "New name";

    const updatedCategoria: CategoriaEntity = await service.update(category.id, category);
    expect(updatedCategoria).not.toBeNull();
  
    const storedCategoria: CategoriaEntity = await repository.findOne({ where: { id: category.id } })
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(category.nombre)
  });
 
  it('update should throw an exception for an invalid category', async () => {
    let category: CategoriaEntity = categorysList[0];
    category = {
      ...category, nombre: "New name"
    }
    await expect(() => service.update("0", category)).rejects.toHaveProperty("message", "The category with the given id was not found")
  });

  it('delete should remove a category', async () => {
    const category: CategoriaEntity = categorysList[0];
    await service.delete(category.id);
  
    const deletedCategoria: CategoriaEntity = await repository.findOne({ where: { id: category.id } })
    expect(deletedCategoria).toBeNull();
  });

  it('delete should throw an exception for an invalid category', async () => {
    const category: CategoriaEntity = categorysList[0];
    await service.delete(category.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The category with the given id was not found")
  });
 
});

