import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('exchange_rates')
export class Oracle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  source: string;

  @Column({ type: 'numeric', precision: 10, scale: 4 })
  rateUsdBrl: number;

  @CreateDateColumn()
  fetchedAt: Date;
}
