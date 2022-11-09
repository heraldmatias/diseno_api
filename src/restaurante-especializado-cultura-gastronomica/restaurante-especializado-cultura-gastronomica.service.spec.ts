/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEspecializadoCulturaGastronomicaService } from './restaurante-especializado-cultura-gastronomica.service';
import { CacheModule } from '@nestjs/common';

describe('RestauranteEspecializadoCulturaGastronomicaService', () => {
  let service: RestauranteEspecializadoCulturaGastronomicaService;
  let restauranteRepository: Repository<RestauranteEspecializadoEntity>;
  let culturaRepository: Repository<CulturaGastronomicaEntity>;
  let restaurante: RestauranteEspecializadoEntity;
  let culturasList : CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestauranteEspecializadoCulturaGastronomicaService],
    }).compile();

    service = module.get<RestauranteEspecializadoCulturaGastronomicaService>(RestauranteEspecializadoCulturaGastronomicaService);
    restauranteRepository = module.get<Repository<RestauranteEspecializadoEntity>>(getRepositoryToken(RestauranteEspecializadoEntity));
    culturaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    restauranteRepository.clear();
 
    culturasList = [];
    for(let i = 0; i < 5; i++){
        const cultura: CulturaGastronomicaEntity = await culturaRepository.save({
          nombre: faker.company.name(),
          descripcion: faker.lorem.sentence()
        })
        culturasList.push(cultura);
    }
 
    restaurante = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city(),
      culturasGastronomicas: culturasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCulturaRestaurante should add an cultura to a restaurante', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    });
 
    const newRestaurante: RestauranteEspecializadoEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city()
    })
 
    const result: RestauranteEspecializadoEntity = await service.addCulturaRestaurante(newRestaurante.id, newCultura.id);
   
    expect(result.culturasGastronomicas.length).toBe(1);
    expect(result.culturasGastronomicas[0]).not.toBeNull();
    expect(result.culturasGastronomicas[0].nombre).toBe(newCultura.nombre)
    expect(result.culturasGastronomicas[0].descripcion).toBe(newCultura.descripcion)
  });

  it('addCulturaRestaurante should thrown exception for an invalid cultura', async () => {
    const newRestaurante: RestauranteEspecializadoEntity = await restauranteRepository.save({
      nombre: faker.company.name(),
      ciudad: faker.address.city()
    })
 
    await expect(() => service.addCulturaRestaurante(newRestaurante.id, "0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada");
  });

  it('addCulturaRestaurante should throw an exception for an invalid restaurante', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(() => service.addCulturaRestaurante("0", newCultura.id)).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado");
  });

  it('findCulturaByRestauranteIdCulturaId should return cultura by restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    const storedCultura: CulturaGastronomicaEntity = await service.findCulturaByRestauranteIdCulturaId(restaurante.id, cultura.id, )
    expect(storedCultura).not.toBeNull();
    expect(storedCultura.nombre).toBe(cultura.nombre);
    expect(storedCultura.descripcion).toBe(cultura.descripcion);
  });

  it('findCulturaByRestauranteIdCulturaId should throw an exception for an invalid cultura', async () => {
    await expect(()=> service.findCulturaByRestauranteIdCulturaId(restaurante.id, "0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada");
  });

  it('findCulturaByRestauranteIdCulturaId should throw an exception for an invalid restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    await expect(()=> service.findCulturaByRestauranteIdCulturaId("0", cultura.id)).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado");
  });

  it('findCulturaByRestauranteIdCulturaId should throw an exception for an cultura not associated to the restaurante', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.findCulturaByRestauranteIdCulturaId(restaurante.id, newCultura.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no está asociada al restaurante");
  });

  it('findCulturasByRestauranteId should return culturas by restaurante', async ()=>{
    const culturas: CulturaGastronomicaEntity[] = await service.findCulturasByRestauranteId(restaurante.id);
    expect(culturas.length).toBe(5)
  });

  it('findCulturasByRestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.findCulturasByRestauranteId("0")).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado");
  });

  it('associateCulturasRestaurante should update culturas list for a restaurante', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    });
 
    const updatedRestaurante: RestauranteEspecializadoEntity = await service.associateCulturasRestaurante(restaurante.id, [newCultura]);
    expect(updatedRestaurante.culturasGastronomicas.length).toBe(1);
    expect(updatedRestaurante.culturasGastronomicas[0].nombre).toBe(newCultura.nombre);
    expect(updatedRestaurante.culturasGastronomicas[0].descripcion).toBe(newCultura.descripcion);
  });

  it('associateCulturasRestaurante should throw an exception for an invalid restaurante', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.associateCulturasRestaurante("0", [newCultura])).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado");
  });

  it('associateCulturasRestaurante should throw an exception for an invalid cultura', async () => {
    const newCultura: CulturaGastronomicaEntity = culturasList[0];
    newCultura.id = "0";
 
    await expect(()=> service.associateCulturasRestaurante(restaurante.id, [newCultura])).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada");
  });

  it('deleteCulturaToRestaurante should remove an cultura from a restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
   
    await service.deleteCulturaRestaurante(restaurante.id, cultura.id);
 
    const storedRestaurante: RestauranteEspecializadoEntity = await restauranteRepository.findOne({where: {id: restaurante.id}, relations: ["culturasGastronomicas"]});
    const deletedCultura: CulturaGastronomicaEntity = storedRestaurante.culturasGastronomicas.find(c => c.id === cultura.id);
 
    expect(deletedCultura).toBeUndefined();
 
  });

  it('deleteCulturaToRestaurante should thrown an exception for an invalid cultura', async () => {
    await expect(()=> service.deleteCulturaRestaurante(restaurante.id, "0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada");
  });

  it('deleteCulturaToRestaurante should thrown an exception for an invalid restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = culturasList[0];
    await expect(()=> service.deleteCulturaRestaurante("0", cultura.id)).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado");
  });

  it('deleteCulturaToRestaurante should thrown an exception for an non asocciated cultura', async () => {
    const newCultura: CulturaGastronomicaEntity = await culturaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    });
 
    await expect(()=> service.deleteCulturaRestaurante(restaurante.id, newCultura.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no está asociada al restaurante");
  });
});
