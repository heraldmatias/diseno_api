import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { faker } from '@faker-js/faker';

describe('PaisService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await repository.save({
        nombre: `Receta #${i + 1}`,
        descripcion: faker.lorem.sentence(),
        preparacion: faker.lorem.sentence(),
        video: faker.image.imageUrl(),
        foto: faker.image.imageUrl(),
      });
      recetasList.push(receta);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería retornar todas las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne debería retornar una receta por su id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre);
    expect(receta.descripcion).toEqual(storedReceta.descripcion);
    expect(receta.foto).toEqual(storedReceta.foto);
    expect(receta.preparacion).toEqual(storedReceta.preparacion);
    expect(receta.video).toEqual(storedReceta.video);
  });

  it('findOne debería arrojar una excepción al buscar una receta inválida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id indicado no fue encontrada',
    );
  });

  it('Create debería retornar una nueva receta', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: 'Nueva Receta',
      descripcion: faker.lorem.sentence(),
      preparacion: faker.lorem.sentence(),
      foto: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      culturaGastronomica: undefined
    };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: newReceta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre);
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion);
    expect(storedReceta.preparacion).toEqual(newReceta.preparacion);
    expect(storedReceta.foto).toEqual(newReceta.foto);
    expect(storedReceta.video).toEqual(newReceta.video);
  });

  it('delete debería eliminar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    const deletedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(deletedReceta).toBeNull();
  });

  it('delete debería arrojar una excepción para una receta inválida', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id indicado no fue encontrada',
    );
  });

  it('update debería modificar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = 'Nuevo nombre';
    receta.descripcion = 'Nueva descripcion';
    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();
    const storedReceta: RecetaEntity = await repository.findOne({
      where: { id: receta.id },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.descripcion).toEqual(receta.descripcion);
  });

  it('update debería arrojar un error para una receta inválida', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta,
      nombre: 'Nuevo nombre',
      descripcion: 'Nueva descripcion',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'La receta con el id indicado no fue encontrada',
    );
  });
});
