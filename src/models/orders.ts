import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { instrumentsModel } from './instruments';
import { userModel } from './user';

@Entity('orders')
export class ordersModel extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'instrumentid' })
  instrumentId: number;

  @ManyToOne(() => instrumentsModel)
  @JoinColumn({ name: 'instrumentid' })
  instrument: instrumentsModel;

  @Column({ name: 'userid' })
  userId: number;

  @ManyToOne(() => userModel)
  @JoinColumn({ name: 'userid' })
  user: userModel;

  @Column({ name: 'size' })
  size: number;

  @Column({ name: 'price' })
  price: number;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'side' })
  side: string;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'datetime' })
  datetime: Date;
}
