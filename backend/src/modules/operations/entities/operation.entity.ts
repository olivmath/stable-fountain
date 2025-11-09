import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stablecoinId: string;

  @Column()
  type: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  amountRlbrl: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  amountRlusd: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  amountBrl: number;

  @Column({ type: 'numeric', precision: 10, scale: 4, nullable: true })
  exchangeRate: number;

  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  feeCharged: number;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ nullable: true })
  depositRequestId: string;

  @Column({ nullable: true })
  returnMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  returnDestination: Record<string, any>;

  @Column({ nullable: true })
  burnWallet: string;

  @Column({ nullable: true })
  burnMemo: string;

  @Column({ nullable: true })
  blockchainTxHash: string;

  @Column({ nullable: true })
  blockchainBurnTxHash: string;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
