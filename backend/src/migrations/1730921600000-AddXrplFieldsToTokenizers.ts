import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddXrplFieldsToTokenizers1730921600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add issuerWalletAddress column
    await queryRunner.addColumn(
      'tokenizers',
      new TableColumn({
        name: 'issuerWalletAddress',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Add encryptedSeed column (for storing AES-256-CBC encrypted seeds)
    await queryRunner.addColumn(
      'tokenizers',
      new TableColumn({
        name: 'encryptedSeed',
        type: 'text',
        isNullable: true,
      }),
    );

    // Add walletCreatedAt column
    await queryRunner.addColumn(
      'tokenizers',
      new TableColumn({
        name: 'walletCreatedAt',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // Add xrplNetwork column with default 'testnet'
    await queryRunner.addColumn(
      'tokenizers',
      new TableColumn({
        name: 'xrplNetwork',
        type: 'varchar',
        default: "'testnet'",
        isNullable: false,
      }),
    );

    // Create index on issuerWalletAddress for faster queries
    await queryRunner.createIndex(
      'tokenizers',
      new TableIndex({
        name: 'IDX_tokenizers_issuerWalletAddress',
        columnNames: ['issuerWalletAddress'],
      }),
    );

    // Create index on xrplNetwork for filtering by network
    await queryRunner.createIndex(
      'tokenizers',
      new TableIndex({
        name: 'IDX_tokenizers_xrplNetwork',
        columnNames: ['xrplNetwork'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('tokenizers', 'IDX_tokenizers_xrplNetwork');
    await queryRunner.dropIndex('tokenizers', 'IDX_tokenizers_issuerWalletAddress');

    // Drop columns in reverse order
    await queryRunner.dropColumn('tokenizers', 'xrplNetwork');
    await queryRunner.dropColumn('tokenizers', 'walletCreatedAt');
    await queryRunner.dropColumn('tokenizers', 'encryptedSeed');
    await queryRunner.dropColumn('tokenizers', 'issuerWalletAddress');
  }
}
