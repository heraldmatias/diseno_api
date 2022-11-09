import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CacheModule } from '@nestjs/common';

describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturasGastronomicasList: CulturaGastronomicaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    culturasGastronomicasList = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaGastronomicaEntity = await repository.save({
        nombre: `Cultura #${i + 1}`,
        descripcion: `Descript #${i + 1}`
      });
      culturasGastronomicasList.push(cultura);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register() ],
      providers: [CulturaGastronomicaService],
    }).compile();

    service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService);
    repository = module.get<Repository<CulturaGastronomicaEntity>>(
      getRepositoryToken(CulturaGastronomicaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería retornar todas las culturas gastronomicas', async () => {
    const culturasGastronomicas: CulturaGastronomicaEntity[] = await service.findAll();
    expect(culturasGastronomicas).not.toBeNull();
    expect(culturasGastronomicas).toHaveLength(culturasGastronomicasList.length);
  });

  it('findOne debería retornar una cultura gastronomica por su id', async () => {
    const storedCG: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    const culturaGastronomica: CulturaGastronomicaEntity = await service.findOne(storedCG.id);
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica.nombre).toEqual(storedCG.nombre);
  });

  it('findOne debería arrojar una excepción al buscar una cultura gastronomica inválido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id indicado no fue encontrado',
    );
  });

  it('Create debería retornar una nueva cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = {
      id: '',
      nombre: faker.name.fullName(),
      descripcion: 'Nueva Description',
      restaurantesEspecializados: [],
      // culturasGastronomicas: [],
      paises: [],
      recetas: []
    };

    const newCG: CulturaGastronomicaEntity = await service.create(culturaGastronomica);
    expect(newCG).not.toBeNull();

    const storedCG: CulturaGastronomicaEntity = await repository.findOne({
      where: { id: newCG.id },
    });
    expect(storedCG).not.toBeNull();
    expect(storedCG.nombre).toEqual(newCG.nombre);
  });

  it('update debería modificar una Cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    culturaGastronomica.nombre = 'Nuevo nombre';
    const updatedCG: CulturaGastronomicaEntity = await service.update(culturaGastronomica.id, culturaGastronomica);
    expect(updatedCG).not.toBeNull();
    const storedCG: CulturaGastronomicaEntity = await repository.findOne({
      where: { id: culturaGastronomica.id },
    });
    expect(storedCG).not.toBeNull();
    expect(storedCG.nombre).toEqual(culturaGastronomica.nombre);
  });

  it('update debería arrojar una excepción para una Cultura gastronomica inválida', async () => {
    let culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    culturaGastronomica = {
      ...culturaGastronomica,
      nombre: 'Nuevo nombre',
    };
    await expect(() => service.update('0', culturaGastronomica)).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id indicado no fue encontrado',
    );
  });

  it('delete debería eliminar una cultura gastronomica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    await service.delete(culturaGastronomica.id);
    const deletedCulturagastronomica: CulturaGastronomicaEntity = await repository.findOne({
      where: { id: culturaGastronomica.id },
    });
    expect(deletedCulturagastronomica).toBeNull();
  });

  it('delete debería arrojar una excepción para una culturaGastronomica inválido', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = culturasGastronomicasList[0];
    await service.delete(culturaGastronomica.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La cultura gastronomica con el id indicado no fue encontrado',
    );
  });
});
