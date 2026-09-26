import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';
import 'dotenv/config';

export default ormConfig({
  contract: './src/prisma/contract.prisma',
  db: {
    connection: process.env['DATABASE_URL']!,
  },
});
