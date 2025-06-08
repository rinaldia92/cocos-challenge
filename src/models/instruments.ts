import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('instruments')
export class instrumentsModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  ticker: string;

  @Column()
  name: string;

  @Column()
  type: string;
}
