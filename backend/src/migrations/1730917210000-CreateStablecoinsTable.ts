import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateStablecoinsTable1730917210000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'stablecoins',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'tokenizerId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'clientId',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'clientWallet',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            default: "'RLBRL'",
            isNullable: false,
          },
          {
            name: 'paymentMethod',
            type: 'varchar',
            default: "'PIX'",
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending_deposit'",
            isNullable: false,
          },
          {
            name: 'totalIssuedRlbrl',
            type: 'numeric',
            precision: 20,
            scale: 8,
            default: '0',
          },
          {
            name: 'totalDepositedBrl',
            type: 'numeric',
            precision: 20,
            scale: 8,
            default: '0',
          },
          {
            name: 'webhookUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'activatedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'stablecoins',
      new TableForeignKey({
        columnNames: ['tokenizerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tokenizers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'stablecoins',
      new TableIndex({
        name: 'IDX_stablecoins_clientId',
        columnNames: ['clientId'],
      }),
    );

    await queryRunner.createIndex(
      'stablecoins',
      new TableIndex({
        name: 'IDX_stablecoins_tokenizerId',
        columnNames: ['tokenizerId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stablecoins');
  }
}
