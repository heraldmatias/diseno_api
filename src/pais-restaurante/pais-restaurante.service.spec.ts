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

  it('addRestaurantePais debería asociar un restaurante a un país', async () => {
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

  it('addRestaurantePais debería arrojar una excepción para un restaurante inválido', async () => {
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

  it('addRestaurantePais debería arrojar una excepción para un país inválido', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    await expect(() =>
      service.addRestaurantePais('0', newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByPaisIdRestauranteId debería retornar un restaurante por un país', async () => {
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

  it('findRestauranteByPaisIdRestauranteId debería arrojar una excepción para un restaurante inválido', async () => {
    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByPaisIdRestauranteId debería arrojar una excepción para un país inválido', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('findRestauranteByPaisIdRestauranteId debería arrojar un error para un restaurante no asociado a un país', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    await expect(() =>
      service.findRestauranteByPaisIdRestauranteId(pais.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no está asociado al país indicado',
    );
  });

  it('findRestaurantesByPaisId debería retornar los restaurantes por un país', async () => {
    const restaurantes: RestauranteEspecializadoEntity[] =
      await service.findRestaurantesByPaisId(pais.id);
    expect(restaurantes.length).toBe(5);
  });

  it('findRestaurantesByPaisId debería arrojar una excepción para un país inválido', async () => {
    await expect(() =>
      service.findRestaurantesByPaisId('0'),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('associateRestaurantesPais debería actualizar la lista de restaurantes de un país', async () => {
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

  it('associateRestaurantesPais debería arrojar una excepción para un país inválido', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });
    await expect(() =>
      service.associateRestaurantesPais('0', [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id dado no fue encontrado',
    );
  });

  it('associateRestaurantesPais debería arrojar una excepción para un restaurante inválido', async () => {
    const newRestaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    newRestaurante.id = '0';

    await expect(() =>
      service.associateRestaurantesPais(pais.id, [newRestaurante]),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no fue encontrado',
    );
  });

  it('deleteRestaurantePais debería remover un restaurante de un país', async () => {
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

  it('deleteRestaurantePais debería arrojar una excepción para un restaurante inválido', async () => {
    await expect(() =>
      service.deleteRestaurantePais(pais.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id indicado no fue encontrado',
    );
  });

  it('deleteRestaurantePais debería arrojar una excepción para un país inválido', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    await expect(() =>
      service.deleteRestaurantePais('0', restaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El país con el id indicado no fue encontrado',
    );
  });

  it('deleteRestaurantePais debería arrojar una excepción por un restaurante no asociado a un país', async () => {
    const newRestaurante: RestauranteEspecializadoEntity =
      await restauranteRepository.save({
        nombre: faker.name.firstName(),
        ciudad: faker.address.city(),
      });

    await expect(() =>
      service.deleteRestaurantePais(pais.id, newRestaurante.id),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id indicado no está asociado al país',
    );
  });
});
