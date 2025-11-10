import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddXrplFieldsToStablecoins1730921610000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename 'currency' column to 'currencyCode' and make it unique
    await queryRunner.renameColumn('stablecoins', 'currency', 'currencyCode');

    // Add unique constraint to currencyCode
    await queryRunner.createIndex(
      'stablecoins',
      new TableIndex({
        name: 'IDX_stablecoins_currencyCode',
        columnNames: ['currencyCode'],
        isUnique: true,
      }),
    );

    // Rename 'totalIssuedRlbrl' to 'totalSupply'
    await queryRunner.renameColumn('stablecoins', 'totalIssuedRlbrl', 'totalSupply');

    // Rename 'paymentMethod' to 'depositMode'
    await queryRunner.renameColumn('stablecoins', 'paymentMethod', 'depositMode');

    // Update status default from 'pending_deposit' to 'pending_setup'
    // First drop the current default by updating the column
    await queryRunner.changeColumn(
      'stablecoins',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        default: "'pending_setup'",
        isNullable: false,
      }),
    );

    // Add issuerWalletAddress column
    await queryRunner.addColumn(
      'stablecoins',
      new TableColumn({
        name: 'issuerWalletAddress',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Add encryptedSeed column (for storing AES-256-CBC encrypted seeds)
    await queryRunner.addColumn(
      'stablecoins',
      new TableColumn({
        name: 'encryptedSeed',
        type: 'text',
        isNullable: true,
      }),
    );

    // Add clawbackEnabled column
    await queryRunner.addColumn(
      'stablecoins',
      new TableColumn({
        name: 'clawbackEnabled',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );

    // Add authorizedTrustLinesEnabled column
    await queryRunner.addColumn(
      'stablecoins',
      new TableColumn({
        name: 'authorizedTrustLinesEnabled',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );

    // Add trustLineLimit column
    await queryRunner.addColumn(
      'stablecoins',
      new TableColumn({
        name: 'trustLineLimit',
        type: 'numeric',
        precision: 20,
        scale: 8,
        isNullable: true,
      }),
    );

    // Create indexes for faster queries
    await queryRunner.createIndex(
      'stablecoins',
      new TableIndex({
        name: 'IDX_stablecoins_issuerWalletAddress',
        columnNames: ['issuerWalletAddress'],
      }),
    );

    await queryRunner.createIndex(
      'stablecoins',
      new TableIndex({
        name: 'IDX_stablecoins_depositMode',
        columnNames: ['depositMode'],
      }),
    );

    await queryRunner.createIndex(
      'stablecoins',
      new TableIndex({
        name: 'IDX_stablecoins_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.dropIndex('stablecoins', 'IDX_stablecoins_status');
    await queryRunner.dropIndex('stablecoins', 'IDX_stablecoins_depositMode');
    await queryRunner.dropIndex('stablecoins', 'IDX_stablecoins_issuerWalletAddress');
    await queryRunner.dropIndex('stablecoins', 'IDX_stablecoins_currencyCode');

    // Drop columns in reverse order
    await queryRunner.dropColumn('stablecoins', 'trustLineLimit');
    await queryRunner.dropColumn('stablecoins', 'authorizedTrustLinesEnabled');
    await queryRunner.dropColumn('stablecoins', 'clawbackEnabled');
    await queryRunner.dropColumn('stablecoins', 'encryptedSeed');
    await queryRunner.dropColumn('stablecoins', 'issuerWalletAddress');

    // Rename columns back to original names
    await queryRunner.renameColumn('stablecoins', 'depositMode', 'paymentMethod');
    await queryRunner.renameColumn('stablecoins', 'totalSupply', 'totalIssuedRlbrl');
    await queryRunner.renameColumn('stablecoins', 'currencyCode', 'currency');

    // Update status default back to 'pending_deposit'
    await queryRunner.changeColumn(
      'stablecoins',
      'status',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        default: "'pending_deposit'",
        isNullable: false,
      }),
    );
  }
}
