import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CategoriaDto } from './categoria.dto';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';

@Resolver()
export class CategoriaResolver {
    constructor(private categoriaService: CategoriaService) {}

    @Query(() => [CategoriaEntity])
    categorias(): Promise<CategoriaEntity[]> {
        return this.categoriaService.findAll();
    }
 
    @Query(() => CategoriaEntity)
    categoria(@Args('id') id: string): Promise<CategoriaEntity> {
        return this.categoriaService.findOne(id);
    }

    @Mutation(() => CategoriaEntity)
    createCategoria(@Args('categoria') categoriaDto: CategoriaDto): Promise<CategoriaEntity> {
        const categoria = plainToInstance(CategoriaEntity, categoriaDto);
        return this.categoriaService.create(categoria);
    }
 
    @Mutation(() => CategoriaEntity)
    updateCategoria(@Args('id') id: string, @Args('categoria') categoriaDto: CategoriaDto): Promise<CategoriaEntity> {
        const categoria = plainToInstance(CategoriaEntity, categoriaDto);
        return this.categoriaService.update(id, categoria);
    }
 
    @Mutation(() => String)
    deleteCategoria(@Args('id') id: string) {
        this.categoriaService.delete(id);
        return id;
    }

}