import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('stablecoins')
export class Stablecoin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenizerId: string;

  @Column({ unique: true })
  clientId: string;

  @Column()
  name: string;

  @Column()
  clientWallet: string;

  @Column({ default: 'RLBRL' })
  currency: string;

  @Column({ default: 'PIX' })
  paymentMethod: string;

  @Column({ default: 'pending_deposit' })
  status: string;

  @Column({ type: 'numeric', precision: 20, scale: 8, default: 0 })
  totalIssuedRlbrl: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, default: 0 })
  totalDepositedBrl: number;

  @Column({ nullable: true })
  webhookUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  activatedAt: Date;
}
