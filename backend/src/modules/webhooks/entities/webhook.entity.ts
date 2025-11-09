import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('webhook_events')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tokenizerId: string;

  @Column()
  eventType: string;

  @Column({ nullable: true })
  stablecoinId: string;

  @Column({ nullable: true })
  operationId: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, any>;

  @Column()
  webhookUrl: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 0 })
  attempts: number;

  @Column({ nullable: true })
  lastAttemptAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
