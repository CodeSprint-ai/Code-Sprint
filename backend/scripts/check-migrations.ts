import { AppDataSource } from '../src/data-sourse';

async function checkMigrations() {
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    const result = await queryRunner.query('SELECT * FROM migrations');
    console.log(JSON.stringify(result, null, 2));

    await AppDataSource.destroy();
}

checkMigrations();
