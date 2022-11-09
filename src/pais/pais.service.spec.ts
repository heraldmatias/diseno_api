import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisesList: PaisEntity[];

  const seedDatabase = async () => {
    repository.clear();
    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save({
        nombre: `País #${i + 1}`,
      });
      paisesList.push(pais);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería retornar todos los países', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisesList.length);
  });

  it('findOne debería retornar un país por su id', async () => {
    const storedPais: PaisEntity = paisesList[0];
    const pais: PaisEntity = await service.findOne(storedPais.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre);
  });

  it('findOne debería arrojar una excepción al buscar un país inválido', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El país con el id indicado no fue encontrado',
    );
  });

  it('Create debería retornar un nuevo país', async () => {
    const pais: PaisEntity = {
      id: '',
      nombre: 'Nuevo País',
      restaurantesEspecializados: [],
      culturasGastronomicas: []
    };

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({
      where: { id: newPais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre);
  });

  it('update debería modificar un país', async () => {
    const pais: PaisEntity = paisesList[0];
    pais.nombre = 'Nuevo nombre';
    const updatedPais: PaisEntity = await service.update(pais.id, pais);
    expect(updatedPais).not.toBeNull();
    const storedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre);
  });

  it('update debería arrojar una excepción para un país inválido', async () => {
    let pais: PaisEntity = paisesList[0];
    pais = {
      ...pais,
      nombre: 'Nuevo nombre',
    };
    await expect(() => service.update('0', pais)).rejects.toHaveProperty(
      'message',
      'El país con el id indicado no fue encontrado',
    );
  });

  it('delete debería eliminar un país', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    const deletedPais: PaisEntity = await repository.findOne({
      where: { id: pais.id },
    });
    expect(deletedPais).toBeNull();
  });

  it('delete debería arrojar una excepción para un pais inválido', async () => {
    const pais: PaisEntity = paisesList[0];
    await service.delete(pais.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El país con el id indicado no fue encontrado',
    );
  });
});
