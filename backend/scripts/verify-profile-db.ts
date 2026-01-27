import { AppDataSource } from '../src/data-sourse';
import { User } from '../src/user/entities/user.model';

async function verify() {
    try {
        console.log('Initializing DataSource...');
        await AppDataSource.initialize();
        console.log('DataSource initialized.');

        console.log('Fetching a user to check schema...');
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: {},
            select: ['uuid', 'email', 'username', 'bio', 'country', 'socialLinks'], // Explicitly select new fields
        });

        if (user) {
            console.log('User found:', user.email);
            console.log('Username:', user.username);
            console.log('Bio:', user.bio);
        } else {
            console.log('No users found in database, but query succeeded.');
        }

        console.log('✅ Schema verification successful!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Schema verification failed:', error);
        process.exit(1);
    }
}

verify();
