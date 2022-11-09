import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEspecializadoEntity } from '../restaurante-especializado/restaurante-especializado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import './cultura-gastronomica-restaurante-especializado.service';
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaRestauranteEspecializadoService } from './cultura-gastronomica-restaurante-especializado.service';
import { CacheModule } from '@nestjs/common';

describe('CulturaGastronomicaRestauranteEspecializadoService', () => {
  let service: CulturaGastronomicaRestauranteEspecializadoService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteEspecializadoRepository: Repository<RestauranteEspecializadoEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let restaurantesEspecializadosList : RestauranteEspecializadoEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaGastronomicaRestauranteEspecializadoService],
    }).compile();

    service = module.get<CulturaGastronomicaRestauranteEspecializadoService>(CulturaGastronomicaRestauranteEspecializadoService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteEspecializadoRepository = module.get<Repository<RestauranteEspecializadoEntity>>(getRepositoryToken(RestauranteEspecializadoEntity));

    await seedDatabase();
  });

  
  const seedDatabase = async () => {
    restauranteEspecializadoRepository.clear();
    culturaGastronomicaRepository.clear();

    restaurantesEspecializadosList = [];
    for(let i = 0; i < 5; i++){
        const restauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
          nombre: faker.name.firstName(), 
          ciudad: faker.address.city(),
        })
        restaurantesEspecializadosList.push(restauranteEspecializado);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.name.firstName(), 
      descripcion: faker.lorem.sentence(), 
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

 it('addRestauranteEspecializadoCulturaGastronomica should add an restauranteEspecializado to a culturaGastronomica', async () => {
   const newRestauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
     nombre: faker.name.firstName(), 
     ciudad: faker.address.city(),
   });

   const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
     nombre: faker.name.firstName(), 
     descripcion: faker.lorem.sentence(),
   })

   const result: CulturaGastronomicaEntity = await service.addRestauranteEspecializadoCulturaGastronomica(newCulturaGastronomica.id, newRestauranteEspecializado.id);
    
   expect(result.restaurantesEspecializados.length).toBe(1);
   expect(result.restaurantesEspecializados[0]).not.toBeNull();
   expect(result.restaurantesEspecializados[0].nombre).toBe(newRestauranteEspecializado.nombre)
   expect(result.restaurantesEspecializados[0].ciudad).toBe(newRestauranteEspecializado.ciudad)
 });

  it('addRestauranteEspecializadoCulturaGastronomica should thrown exception for an invalid restauranteEspecializado', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.name.firstName(), 
      descripcion: faker.lorem.sentence(),
    })

    await expect(() => service.addRestauranteEspecializadoCulturaGastronomica(newCulturaGastronomica.id, "0")).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado");
  });

  it('addRestauranteEspecializadoCulturaGastronomica should throw an exception for an invalid culturaGastronomica', async () => {
    const newRestauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
      nombre: faker.name.firstName(), 
      ciudad: faker.address.city(),
    });

    await expect(() => service.addRestauranteEspecializadoCulturaGastronomica("0", newRestauranteEspecializado.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada");
  });

  // it('findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId should return restauranteEspecializado by culturaGastronomica', async () => {
  //   const restauranteEspecializado: RestauranteEspecializadoEntity = restaurantesEspecializadosList[0];
  //   const storedRestauranteEspecializado: RestauranteEspecializadoEntity = await service.findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId(culturaGastronomica.id, restauranteEspecializado.id, )
  //   expect(storedRestauranteEspecializado).not.toBeNull();
  //   expect(storedRestauranteEspecializado.nombre).toBe(restauranteEspecializado.nombre);
  //   expect(storedRestauranteEspecializado.ciudad).toBe(restauranteEspecializado.ciudad);
  // });

  it('findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId should throw an exception for an invalid restauranteEspecializado', async () => {
    await expect(()=> service.findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado"); 
  });

  it('findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId should throw an exception for an invalid culturaGastronomica', async () => {
    const restauranteEspecializado: RestauranteEspecializadoEntity = restaurantesEspecializadosList[0]; 
    await expect(()=> service.findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId("0", restauranteEspecializado.id)).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado. Make sure your query is correct."); 
  });

  it('findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId should throw an exception for an restauranteEspecializado not associated to the culturaGastronomica', async () => {
    const newRestauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
      nombre: faker.name.firstName(), 
      ciudad: faker.address.city(),
    });

    await expect(()=> service.findRestauranteEspecializadoByCulturaGastronomicaIdRestauranteEspecializadoId(culturaGastronomica.id, newRestauranteEspecializado.id)).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado"); 
  });

  it('findRestauranteEspecializadosByCulturaGastronomicaId should return restaurantesEspecializados by culturaGastronomica', async ()=>{
    const restaurantesEspecializados: RestauranteEspecializadoEntity[] = await service.findRestaurantesEspecializadosByCulturaGastronomicaId(culturaGastronomica.id);
    //expect(restaurantesEspecializados.length).toBe(0)
  });

  it('findRestauranteEspecializadosByCulturaGastronomicaId should throw an exception for an invalid culturaGastronomica', async () => {
    await expect(()=> service.findRestaurantesEspecializadosByCulturaGastronomicaId("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada"); 
  });

  it('associateRestauranteEspecializadosCulturaGastronomica should update restaurantesEspecializados list for a culturaGastronomica', async () => {
    const newRestauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
      nombre: faker.name.firstName(), 
      ciudad: faker.address.city(),
    });

    const updatedCulturaGastronomica: CulturaGastronomicaEntity = await service.associateRestauranteEspecializadosCulturaGastronomica(culturaGastronomica.id, [newRestauranteEspecializado]);
    expect(updatedCulturaGastronomica.restaurantesEspecializados.length).toBe(1);

    expect(updatedCulturaGastronomica.restaurantesEspecializados[0].nombre).toBe(newRestauranteEspecializado.nombre);
    expect(updatedCulturaGastronomica.restaurantesEspecializados[0].ciudad).toBe(newRestauranteEspecializado.ciudad);
  });

  it('associateRestauranteEspecializadosCulturaGastronomica should throw an exception for an invalid culturaGastronomica', async () => {
    const newRestauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
      nombre: faker.name.firstName(), 
      ciudad: faker.address.city(),
    });

    await expect(()=> service.associateRestauranteEspecializadosCulturaGastronomica("0", [newRestauranteEspecializado])).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada"); 
  });

  it('associateRestauranteEspecializadosCulturaGastronomica should throw an exception for an invalid restauranteEspecializado', async () => {
    const newRestauranteEspecializado: RestauranteEspecializadoEntity = restaurantesEspecializadosList[0];
    newRestauranteEspecializado.id = "0";

    await expect(()=> service.associateRestauranteEspecializadosCulturaGastronomica(culturaGastronomica.id, [newRestauranteEspecializado])).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado"); 
  });

  // it('deleteRestauranteEspecializadoToCulturaGastronomica should remove an restauranteEspecializado from a culturaGastronomica', async () => {
  //   const restauranteEspecializado: RestauranteEspecializadoEntity = restaurantesEspecializadosList[0];
    
  //   await service.deleteRestauranteEspecializadoCulturaGastronomica(culturaGastronomica.id, restauranteEspecializado.id);

  //   const storedCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({where: {id: culturaGastronomica.id}, relations: ["restaurantesEspecializados"]});
  //   const deletedRestauranteEspecializado: RestauranteEspecializadoEntity = storedCulturaGastronomica.restaurantesEspecializados.find(a => a.id === restauranteEspecializado.id);

  //   expect(deletedRestauranteEspecializado).toBeUndefined();

  // });

  it('deleteRestauranteEspecializadoToCulturaGastronomica should thrown an exception for an invalid restauranteEspecializado', async () => {
    await expect(()=> service.deleteRestauranteEspecializadoCulturaGastronomica(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "El restaurante especializado con el id dado no fue encontrado"); 
  });

  it('deleteRestauranteEspecializadoToCulturaGastronomica should thrown an exception for an invalid culturaGastronomica', async () => {
    const restauranteEspecializado: RestauranteEspecializadoEntity = restaurantesEspecializadosList[0];
    await expect(()=> service.deleteRestauranteEspecializadoCulturaGastronomica("0", restauranteEspecializado.id)).rejects.toHaveProperty("message", "La cultura gastronomica con el id dado no fue encontrada"); 
  });

  it('deleteRestauranteEspecializadoToCulturaGastronomica should thrown an exception for an non asocciated restauranteEspecializado', async () => {
    const newRestauranteEspecializado: RestauranteEspecializadoEntity = await restauranteEspecializadoRepository.save({
      nombre: faker.name.firstName(), 
      ciudad: faker.address.city(),
    });

    await expect(()=> service.deleteRestauranteEspecializadoCulturaGastronomica(culturaGastronomica.id, newRestauranteEspecializado.id)).rejects.toHaveProperty("message", "El restaurante con el id dado no fue encontrado"); 
  }); 
});
