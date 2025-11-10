import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

/**
 * Tokenizer Entity
 *
 * Representa uma empresa tokenizadora (cliente B2B)
 * Que usa a plataforma para emitir stablecoins customizadas
 */
@Entity('tokenizers')
export class Tokenizer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  apiKeyHash: string;

  @Column({ nullable: true })
  subscriptionTier: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // ========================================
  // XRPL FIELDS
  // ========================================

  /**
   * Wallet XRPL que a tokenizadora usa como issuer
   * Pode ser compartilhada ou única por cliente
   */
  @Column({ nullable: true })
  issuerWalletAddress: string;

  /**
   * Seed criptografada da wallet issuer
   * Armazenada no banco por enquanto (migrar para Vault em produção)
   * Formato: AES-256-CBC encriptado em base64
   */
  @Column({ type: 'text', nullable: true })
  encryptedSeed: string;

  /**
   * Data de criação da wallet XRPL
   */
  @Column({ type: 'timestamp', nullable: true })
  walletCreatedAt: Date;

  /**
   * Rede XRPL que a wallet usa
   * Valores: 'testnet', 'mainnet'
   */
  @Column({ default: 'testnet' })
  xrplNetwork: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
