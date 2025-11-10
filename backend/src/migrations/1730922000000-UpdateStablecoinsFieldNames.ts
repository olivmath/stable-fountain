import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

/**
 * Migration to align Stablecoin entity with CreateStablecoinDto field names
 * from LOGGING_EXAMPLE.md documentation
 *
 * Changes:
 * - tokenizerId → companyId
 * - name → clientName
 * - clientWallet → companyWallet
 * - Add depositType column
 * - Add stableCode column (currently using currencyCode, stableCode is the documented name)
 */
export class UpdateStablecoinsFieldNames1730922000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename tokenizerId to companyId
    await queryRunner.renameColumn('stablecoins', 'tokenizerId', 'companyId');

    // Rename name to clientName
    await queryRunner.renameColumn('stablecoins', 'name', 'clientName');

    // Rename clientWallet to companyWallet
    await queryRunner.renameColumn('stablecoins', 'clientWallet', 'companyWallet');

    // Add depositType column if it doesn't exist
    // Default to RLUSD for existing records
    try {
      await queryRunner.addColumn(
        'stablecoins',
        new TableColumn({
          name: 'depositType',
          type: 'varchar',
          default: "'RLUSD'",
          isNullable: false,
        }),
      );
    } catch (error) {
      // Column might already exist
      console.log('depositType column already exists or error adding it', error.message);
    }

    // Add stableCode column as copy of currencyCode
    // stableCode is the documented field name from API
    try {
      await queryRunner.addColumn(
        'stablecoins',
        new TableColumn({
          name: 'stableCode',
          type: 'varchar',
          length: '40',
          isNullable: true,
        }),
      );
    } catch (error) {
      // Column might already exist
      console.log('stableCode column already exists or error adding it', error.message);
    }

    // Create indexes for new columns
    try {
      await queryRunner.createIndex(
        'stablecoins',
        new TableIndex({
          name: 'IDX_stablecoins_depositType',
          columnNames: ['depositType'],
        }),
      );
    } catch (error) {
      // Index might already exist
      console.log('depositType index already exists');
    }

    try {
      await queryRunner.createIndex(
        'stablecoins',
        new TableIndex({
          name: 'IDX_stablecoins_stableCode',
          columnNames: ['stableCode'],
          isUnique: true,
        }),
      );
    } catch (error) {
      // Index might already exist
      console.log('stableCode index already exists');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    try {
      await queryRunner.dropIndex('stablecoins', 'IDX_stablecoins_stableCode');
    } catch (error) {
      console.log('Could not drop stableCode index');
    }

    try {
      await queryRunner.dropIndex('stablecoins', 'IDX_stablecoins_depositType');
    } catch (error) {
      console.log('Could not drop depositType index');
    }

    // Drop columns
    try {
      await queryRunner.dropColumn('stablecoins', 'stableCode');
    } catch (error) {
      console.log('Could not drop stableCode column');
    }

    try {
      await queryRunner.dropColumn('stablecoins', 'depositType');
    } catch (error) {
      console.log('Could not drop depositType column');
    }

    // Rename columns back to original names
    try {
      await queryRunner.renameColumn('stablecoins', 'companyWallet', 'clientWallet');
    } catch (error) {
      console.log('Could not rename companyWallet back to clientWallet');
    }

    try {
      await queryRunner.renameColumn('stablecoins', 'clientName', 'name');
    } catch (error) {
      console.log('Could not rename clientName back to name');
    }

    try {
      await queryRunner.renameColumn('stablecoins', 'companyId', 'tokenizerId');
    } catch (error) {
      console.log('Could not rename companyId back to tokenizerId');
    }
  }
}
