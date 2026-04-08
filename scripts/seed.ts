import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { Organization } from '../src/modules/organizations/organization.entity';
import { User } from '../src/modules/users/user.entity';
import { Customer } from '../src/modules/customers/customer.entity';
import { Note } from '../src/modules/notes/note.entity';
import { ActivityLog } from '../src/modules/activity-log/activity-log.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { ActivityAction } from '../src/modules/activity-log/enums/activity-action.enum';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DIRECT_URL,
  entities: [Organization, User, Customer, Note, ActivityLog],
  synchronize: true, // Allow schema creation for the initial seed
  ssl: process.env.DIRECT_URL?.includes('supabase') ? { rejectUnauthorized: false } : false,
});

async function seed(): Promise<void> {
  await dataSource.initialize();
  console.log('🌱 Starting seed...');

  const orgRepo = dataSource.getRepository(Organization);
  const userRepo = dataSource.getRepository(User);
  const customerRepo = dataSource.getRepository(Customer);
  const noteRepo = dataSource.getRepository(Note);
  const logRepo = dataSource.getRepository(ActivityLog);

  // Clear existing seed data (idempotent)
  await logRepo.query(`TRUNCATE activity_logs, notes, customers, users, organizations RESTART IDENTITY CASCADE`);

  // 1. Organization
  const org = orgRepo.create({ name: 'Acme Corporation' });
  const savedOrg = await orgRepo.save(org);
  console.log(`✅ Organization: ${savedOrg.name} (${savedOrg.id})`);

  // 2. Users
  const hash = async (p: string) => bcrypt.hash(p, 12);

  const admin = userRepo.create({
    name: 'Admin User',
    email: 'admin@acme.com',
    password: await hash('Password123!'),
    role: UserRole.ADMIN,
    organizationId: savedOrg.id,
  });
  const member1 = userRepo.create({
    name: 'Alice Member',
    email: 'alice@acme.com',
    password: await hash('Password123!'),
    role: UserRole.MEMBER,
    organizationId: savedOrg.id,
  });
  const member2 = userRepo.create({
    name: 'Bob Member',
    email: 'bob@acme.com',
    password: await hash('Password123!'),
    role: UserRole.MEMBER,
    organizationId: savedOrg.id,
  });

  const [savedAdmin, savedMember1, savedMember2] = await userRepo.save([
    admin,
    member1,
    member2,
  ]);
  console.log(`✅ Users created: admin, alice, bob`);

  // 3. 20 sample customers
  const customerData = Array.from({ length: 20 }, (_, i) => ({
    name: `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
    organizationId: savedOrg.id,
    // Assign first 5 to alice, next 3 to bob
    assignedTo:
      i < 5
        ? savedMember1.id
        : i < 8
          ? savedMember2.id
          : null,
  }));

  const customers = customerRepo.create(customerData);
  const savedCustomers = await customerRepo.save(customers);
  console.log(`✅ 20 customers created`);

  // Soft-delete customers 18, 19, 20
  await customerRepo.softDelete(savedCustomers[17].id);
  await customerRepo.softDelete(savedCustomers[18].id);
  await customerRepo.softDelete(savedCustomers[19].id);
  console.log(`✅ Soft-deleted customers 18, 19, 20`);

  // 4. Notes on first 5 customers
  const noteEntities = savedCustomers.slice(0, 5).map((c, i) =>
    noteRepo.create({
      content: `Initial note for ${c.name} — follow up in Q${i + 1}`,
      customerId: c.id,
      organizationId: savedOrg.id,
      createdBy: i % 2 === 0 ? savedAdmin.id : savedMember1.id,
    }),
  );
  await noteRepo.save(noteEntities);
  console.log(`✅ 5 notes created`);

  // 5. Activity logs
  const logEntries = [
    ...savedCustomers.slice(0, 17).map((c) =>
      logRepo.create({
        entityType: 'customer',
        entityId: c.id,
        action: ActivityAction.CUSTOMER_CREATED,
        performedBy: savedAdmin.id,
        organizationId: savedOrg.id,
      }),
    ),
    // Assignment logs
    ...savedCustomers.slice(0, 5).map((c) =>
      logRepo.create({
        entityType: 'customer',
        entityId: c.id,
        action: ActivityAction.CUSTOMER_ASSIGNED,
        performedBy: savedAdmin.id,
        organizationId: savedOrg.id,
      }),
    ),
    // Delete logs
    ...[17, 18, 19].map((idx) =>
      logRepo.create({
        entityType: 'customer',
        entityId: savedCustomers[idx].id,
        action: ActivityAction.CUSTOMER_DELETED,
        performedBy: savedAdmin.id,
        organizationId: savedOrg.id,
      }),
    ),
    // Note logs
    ...savedCustomers.slice(0, 5).map((c) =>
      logRepo.create({
        entityType: 'customer',
        entityId: c.id,
        action: ActivityAction.NOTE_ADDED,
        performedBy: savedAdmin.id,
        organizationId: savedOrg.id,
      }),
    ),
  ];

  await logRepo.save(logEntries);
  console.log(`✅ Activity logs created`);

  await dataSource.destroy();
  console.log('\n🎉 Seed complete!');
  console.log('   Org:   Acme Corporation');
  console.log('   Login: admin@acme.com / Password123!');
  console.log('          alice@acme.com / Password123!');
  console.log('          bob@acme.com   / Password123!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
