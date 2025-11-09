import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateOperationsTable1730917220000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'operations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'stablecoinId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
            isNullable: false,
          },
          {
            name: 'amountRlbrl',
            type: 'numeric',
            precision: 20,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'amountRlusd',
            type: 'numeric',
            precision: 20,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'amountBrl',
            type: 'numeric',
            precision: 20,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'exchangeRate',
            type: 'numeric',
            precision: 10,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'feeCharged',
            type: 'numeric',
            precision: 20,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'paymentMethod',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'depositRequestId',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'returnMethod',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'returnDestination',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'burnWallet',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'burnMemo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'blockchainTxHash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'blockchainBurnTxHash',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'completedAt',
            type: 'timestamp',
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
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'operations',
      new TableForeignKey({
        columnNames: ['stablecoinId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'stablecoins',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'operations',
      new TableIndex({
        name: 'IDX_operations_stablecoinId',
        columnNames: ['stablecoinId'],
      }),
    );

    await queryRunner.createIndex(
      'operations',
      new TableIndex({
        name: 'IDX_operations_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'operations',
      new TableIndex({
        name: 'IDX_operations_type',
        columnNames: ['type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('operations');
  }
}
