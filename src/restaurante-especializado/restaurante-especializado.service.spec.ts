/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEspecializadoEntity } from './restaurante-especializado.entity';
import { RestauranteEspecializadoService } from './restaurante-especializado.service';
import { CacheModule } from '@nestjs/common';

describe('RestauranteEspecializadoService', () => {
  let service: RestauranteEspecializadoService;
  let repository: Repository<RestauranteEspecializadoEntity>;
  let restaurantesList: RestauranteEspecializadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestauranteEspecializadoService],
    }).compile();

    service = module.get<RestauranteEspecializadoService>(RestauranteEspecializadoService);
    repository = module.get<Repository<RestauranteEspecializadoEntity>>(getRepositoryToken(RestauranteEspecializadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantesList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEspecializadoEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.address.city()})
        restaurantesList.push(restaurante);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurantes', async () => {
    const restaurantes: RestauranteEspecializadoEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(restaurantesList.length);
  });

  it('findOne should return a restaurante by id', async () => {
    const storedRestaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    const restaurante: RestauranteEspecializadoEntity = await service.findOne(storedRestaurante.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedRestaurante.nombre);
    expect(restaurante.ciudad).toEqual(storedRestaurante.ciudad);
  });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado")
  });

  it('create should return a new restaurante', async () => {
    const restaurante: RestauranteEspecializadoEntity = {
      id: '',
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      culturasGastronomicas: [],
      pais: undefined
    }
 
    const newRestaurante: RestauranteEspecializadoEntity = await service.create(restaurante);
    expect(newRestaurante).not.toBeNull();
 
    const storedRestaurante: RestauranteEspecializadoEntity = await repository.findOne({where: {id: newRestaurante.id}})
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(newRestaurante.nombre)
    expect(storedRestaurante.ciudad).toEqual(newRestaurante.ciudad)
  });

  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    restaurante.nombre = "Nuevo nombre";
    restaurante.ciudad = "Nueva ciudad";
    const updatedRestaurante: RestauranteEspecializadoEntity = await service.update(restaurante.id, restaurante);
    expect(updatedRestaurante).not.toBeNull();
    const storedRestaurante: RestauranteEspecializadoEntity = await repository.findOne({ where: { id: restaurante.id } })
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toEqual(restaurante.nombre)
    expect(storedRestaurante.ciudad).toEqual(restaurante.ciudad)
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    restaurante = {
      ...restaurante, nombre: "Nuevo nombre", ciudad: "Nueva ciudad"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado")
  });

  it('delete debería eliminar un restaurante', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    const deletedRestaurante: RestauranteEspecializadoEntity = await repository.findOne({ where: { id: restaurante.id } })
    expect(deletedRestaurante).toBeNull();
  });

  it('delete debería arrojar una excepción para un restaurante inválido', async () => {
    const restaurante: RestauranteEspecializadoEntity = restaurantesList[0];
    await service.delete(restaurante.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado")
  });
});
