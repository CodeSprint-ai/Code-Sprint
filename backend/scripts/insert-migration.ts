import { AppDataSource } from '../src/data-sourse';

async function insertMigration() {
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    const timestamp = '1738372800000';
    const name = 'AddSessionManagementAndAccountStatus1738372800000';

    try {
        const existing = await queryRunner.query(`SELECT * FROM migrations WHERE timestamp = '${timestamp}'`);
        if (existing.length > 0) {
            console.log('Migration already recorded');
        } else {
            await queryRunner.query(`INSERT INTO migrations (timestamp, name) VALUES ('${timestamp}', '${name}')`);
            console.log('Migration recorded successfully');
        }
    } catch (e) {
        console.error('Error inserting migration:', e);
    }

    await AppDataSource.destroy();
}

insertMigration();
