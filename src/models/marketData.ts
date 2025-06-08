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

  @Column({ name: 'high' })
  high: number;

  @Column({ name: 'low' })
  low: number;

  @Column({ name: 'open' })
  open: number;

  @Column({ name: 'close' })
  close: number;

  @Column({ name: 'previousclose' })
  previousClose: number;

  @Column({ name: 'change' })
  change: number;

  @Column({ name: 'changepercent' })
  changePercent: number;

  @Column({ name: 'date' })
  date: Date;
}
