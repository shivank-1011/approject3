import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const tables = [
    'User',
    'Group',
    'GroupMember',
    'Expense',
    'ExpenseSplit',
    'Settlement'
  ];

  console.log('Enabling RLS on tables...');

  for (const table of tables) {
    try {
      // Use double quotes for table names to handle case sensitivity properly in PostgreSQL if needed,
      // though typically prisma creates quoted/case-sensitive tables or standard lowercase.
      // Based on schema, Prisma defaults to using the model name as table name typically, or map.
      // We will try standard quoting.
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ Enabled RLS for table: ${table}`);
    } catch (error) {
      console.error(`❌ Failed to enable RLS for table: ${table}`, error);
    }
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
