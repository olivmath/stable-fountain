import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Stablecoin Entity
 *
 * Representa uma stablecoin customizada emitida por um tokenizador
 * Exemplo: APBRL (America Park BRL), XYBRL, etc
 */
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

  /**
   * Wallet XRPL do cliente final que recebe os tokens
   */
  @Column()
  clientWallet: string;

  // ========================================
  // ISSUED CURRENCY FIELDS
  // ========================================

  /**
   * Código da moeda customizada na XRPL
   * Formato: 3-40 caracteres ASCII (ex: APBRL, XYZBRL)
   * Deve ser ÚNICO no sistema
   */
  @Column({ unique: true, length: 40 })
  currencyCode: string;

  /**
   * Modo de depósito suportado
   * Valores: 'PIX', 'ON_CHAIN_XRP', 'ON_CHAIN_RLUSD', 'MIXED'
   */
  @Column({ default: 'PIX' })
  depositMode: string;

  /**
   * Status da stablecoin
   * Valores: 'pending_setup', 'pending_deposit', 'active', 'suspended', 'closed'
   */
  @Column({ default: 'pending_setup' })
  status: string;

  /**
   * Supply total de tokens emitidos na XRPL
   */
  @Column({ type: 'numeric', precision: 20, scale: 8, default: 0 })
  totalSupply: number;

  /**
   * Total depositado em BRL (off-chain tracking)
   */
  @Column({ type: 'numeric', precision: 20, scale: 8, default: 0 })
  totalDepositedBrl: number;

  /**
   * Wallet XRPL do issuer (pode ser compartilhada ou por cliente)
   */
  @Column({ nullable: true })
  issuerWalletAddress: string;

  /**
   * Seed criptografada da wallet issuer
   */
  @Column({ type: 'text', nullable: true })
  encryptedSeed: string;

  /**
   * Se clawback está habilitado na wallet issuer
   */
  @Column({ default: false })
  clawbackEnabled: boolean;

  /**
   * Se trustlines autorizadas (KYC on-chain) estão ativadas
   */
  @Column({ default: false })
  authorizedTrustLinesEnabled: boolean;

  /**
   * Limite máximo de tokens que podem ser emitidos
   * Null = sem limite
   */
  @Column({ type: 'numeric', precision: 20, scale: 8, nullable: true })
  trustLineLimit: number;

  /**
   * URL para receber webhooks quando operações completam
   */
  @Column({ nullable: true })
  webhookUrl: string;

  /**
   * Metadata adicional (KYC docs, chaves PIX, etc)
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  /**
   * Quando a stablecoin foi criada
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Quando foi atualizada pela última vez
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Quando a stablecoin foi ativada e pronta para receber depósitos
   */
  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date;
}
