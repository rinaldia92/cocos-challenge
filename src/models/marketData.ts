import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { instrumentsModel } from './instruments';

@Entity('marketdata')
export class marketDataModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @ManyToOne(() => instrumentsModel)
  @JoinColumn({ name: 'instrumentid' })
  instrument: instrumentsModel;

  @Column({ name: 'high', type: 'float' })
  high: number;

  @Column({ name: 'low', type: 'float' })
  low: number;

  @Column({ name: 'open', type: 'float' })
  open: number;

  @Column({ name: 'close', type: 'float' })
  close: number;

  @Column({ name: 'previousclose', type: 'float' })
  previousClose: number;

  @Column({ name: 'date' })
  date: Date;
}
