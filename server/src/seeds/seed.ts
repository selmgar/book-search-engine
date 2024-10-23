import db from '../config/connection.js';
import userSeed from './userData.json' assert { type: "json" };
import cleanDB from './cleanDB.js';
import User from '../models/User.js';

const seedDatabase = async (): Promise<void> => {
  try {
    await db();
    await cleanDB();

    await User.create(userSeed);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error seeding database:', error.message);
    } else {
      console.error('Unknown error seeding database');
    }
    process.exit(1);
  }
};

seedDatabase();
