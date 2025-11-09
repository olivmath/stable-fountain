import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateExchangeRatesTable1730917230000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'exchange_rates',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'source',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'rateUsdBrl',
            type: 'numeric',
            precision: 10,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'fetchedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'exchange_rates',
      new TableIndex({
        name: 'IDX_exchange_rates_source',
        columnNames: ['source'],
      }),
    );

    await queryRunner.createIndex(
      'exchange_rates',
      new TableIndex({
        name: 'IDX_exchange_rates_fetchedAt',
        columnNames: ['fetchedAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('exchange_rates');
  }
}
