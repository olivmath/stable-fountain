import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateWebhookEventsTable1730917240000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'webhook_events',
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
            name: 'eventType',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'stablecoinId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'operationId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'payload',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'webhookUrl',
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
            name: 'attempts',
            type: 'int',
            default: '0',
            isNullable: false,
          },
          {
            name: 'lastAttemptAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'webhook_events',
      new TableForeignKey({
        columnNames: ['tokenizerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tokenizers',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'webhook_events',
      new TableForeignKey({
        columnNames: ['stablecoinId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'stablecoins',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'webhook_events',
      new TableForeignKey({
        columnNames: ['operationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'operations',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'webhook_events',
      new TableIndex({
        name: 'IDX_webhook_events_tokenizerId',
        columnNames: ['tokenizerId'],
      }),
    );

    await queryRunner.createIndex(
      'webhook_events',
      new TableIndex({
        name: 'IDX_webhook_events_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'webhook_events',
      new TableIndex({
        name: 'IDX_webhook_events_eventType',
        columnNames: ['eventType'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('webhook_events');
  }
}
