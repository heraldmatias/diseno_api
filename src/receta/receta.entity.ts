import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class RecetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  preparacion: string;

  @Column()
  foto: string;

  @Column()
  video: string;

  @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.recetas)
  culturaGastronomica: CulturaGastronomicaEntity;
}
