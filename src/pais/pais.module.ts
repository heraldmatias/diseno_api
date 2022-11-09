import { CacheModule, Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisController } from './pais.controller';
import { PaisResolver } from './pais.resolver';

@Module({
  providers: [PaisService, PaisResolver],
  imports: [TypeOrmModule.forFeature([PaisEntity]), CacheModule.register()],
  controllers: [PaisController],
})
export class PaisModule {}
