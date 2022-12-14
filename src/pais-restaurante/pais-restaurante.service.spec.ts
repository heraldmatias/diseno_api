import { Test, TestingModule } from '@nestjs/testing';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { PaisRestauranteService } from './pais-restaurante.service';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('PaisRestauranteService', () => {
  let service: PaisRestauranteService;
  let paisRepository: Repository<PaisEntity>;
  let restauranteRepository: Repository<RestauranteEspecializadoEntity>;
  let pais: PaisEntity;
  let restaurantesList: RestauranteEspecializadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [PaisRestauranteService],
    }).compile();

    service = module.get<PaisRestauranteService>(PaisRestauranteService);
    paisRepository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    restauranteRepository = module.get<
      Repository<RestauranteEspecializadoEntity>
    >(getRepositoryToken(RestauranteEspecializadoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    paisRepository.clear();

    restaurantesList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEspecializadoEntity =
        await restauranteRepository.save({
          nombre: faker.name.firstName(),
          ciudad: faker.address.city(),
        });
      restaurantesList.push(restaurante);
    }

    pais = await paisRepository.save({
      nombre: faker.address.country(),
      restaurantesEspecializados: restaurantesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantePais deber??a asociar un restaurante a un pa??s', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
    });

    const result: PaisEntity = await service.addRestaurantePais(
      newPais.id,
      newRestaurante.id,
    );

    expect(result.restaurantesEspecializados.length).toBe(1);
    expect(result.restaurantesEspecializados[0]).not.toBeNull();
    expect(result.restaurantesEspecializados[0].nombre).toBe(
      newRestaurante.nombre,
    );
    expect(result.restaurantesEspecializados[0].ciudad).toBe(
      newRestaurante.ciudad,
    );
  });

  it('addRestaurantePais deber??a arrojar una excepci??n para un restaurante inv??lido', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.address.country(),
    });

    await expect(() =>
      service.addRestaurantePais(newPais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('addRestaurantePais deber??a arrojar una excepci??n para un pa??s inv??lido', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    await expect(() =>
      service.addRestaurantePais('0', newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El pa??s con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByPaisIdRestauranteId deber??a retornar un restaurante por un pa??s', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    const storedRestaurante: RestauranteEspecializadoEntity =
      await service.findRestauranteByPaisIdRestauranteId(
        pais.id,
        restaurante.id,
      );
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
    expect(storedRestaurante.ciudad).toBe(restaurante.ciudad);
  });

  it('findRestauranteByPaisIdRestauranteId deber??a arrojar una excepci??n para un restaurante inv??lido', async () => {
    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByPaisIdRestauranteId deber??a arrojar una excepci??n para un pa??s inv??lido', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El pa??s con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByPaisIdRestauranteId deber??a arrojar un error para un restaurante no asociado a un pa??s', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId(pais.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no est?? asociado al pa??s indicado',
    );
  });

  it('findRestaurantesByPaisId deber??a retornar los restaurantes por un pa??s', async () => {
    const restaurantes: RestauranteEspecializadoEntity[] =
      await service.findRestaurantesByPaisId(pais.id);
    expect(restaurantes.length).toBe(5);
  });

  it('findRestaurantesByPaisId deber??a arrojar una excepci??n para un pa??s inv??lido', async () => {
    await expect(() =>
      service.findRestaurantesByPaisId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El pa??s con el id dado no fue encontrado',
    );
  });

  it('associateRestaurantesPais deber??a actualizar la lista de restaurantes de un pa??s', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    const updatedPais: PaisEntity = await service.associateRestaurantesPais(
      pais.id,
      [newRestaurante],
    );
    expect(updatedPais.restaurantesEspecializados.length).toBe(1);

    expect(updatedPais.restaurantesEspecializados[0].nombre).toBe(
      newRestaurante.nombre,
    );
    expect(updatedPais.restaurantesEspecializados[0].ciudad).toBe(
      newRestaurante.ciudad,
    );
  });

  it('associateRestaurantesPais deber??a arrojar una excepci??n para un pa??s inv??lido', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });
    await expect(() =>
      service.associateRestaurantesPais('0', [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'El pa??s con el id dado no fue encontrado',
    );
  });

  it('associateRestaurantesPais deber??a arrojar una excepci??n para un restaurante inv??lido', async () => {
    const newRestaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    newRestaurante.id = '0';

    await expect(() =>
      service.associateRestaurantesPais(pais.id, [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('deleteRestaurantePais deber??a remover un restaurante de un pa??s', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];

    await service.deleteRestaurantePais(pais.id, restaurante.id);

    const storedPais: PaisEntity = await paisRepository.findOne({
      where: { id: pais.id },
      relations: ['restaurantesEspecializados'],
    });
    const deletedRestaurante: RestauranteEspecializadoEntity =
      storedPais.restaurantesEspecializados.find(
        (a) => a.id === restaurante.id,
      );

    expect(deletedRestaurante).toBeUndefined();
  });

  it('deleteRestaurantePais deber??a arrojar una excepci??n para un restaurante inv??lido', async () => {
    await expect(() =>
      service.deleteRestaurantePais(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id indicado no fue encontrado',
    );
  });

  it('deleteRestaurantePais deber??a arrojar una excepci??n para un pa??s inv??lido', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    await expect(() =>
      service.deleteRestaurantePais('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El pa??s con el id indicado no fue encontrado',
    );
  });

  it('deleteRestaurantePais deber??a arrojar una excepci??n por un restaurante no asociado a un pa??s', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    await expect(() =>
      service.deleteRestaurantePais(pais.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id indicado no est?? asociado al pa??s',
    );
  });
});
