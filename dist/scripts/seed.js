"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const organization_entity_1 = require("../src/modules/organizations/organization.entity");
const user_entity_1 = require("../src/modules/users/user.entity");
const customer_entity_1 = require("../src/modules/customers/customer.entity");
const note_entity_1 = require("../src/modules/notes/note.entity");
const activity_log_entity_1 = require("../src/modules/activity-log/activity-log.entity");
const user_role_enum_1 = require("../src/modules/users/enums/user-role.enum");
const activity_action_enum_1 = require("../src/modules/activity-log/enums/activity-action.enum");
dotenv.config();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'crm_db',
    entities: [organization_entity_1.Organization, user_entity_1.User, customer_entity_1.Customer, note_entity_1.Note, activity_log_entity_1.ActivityLog],
    synchronize: false,
});
async function seed() {
    await dataSource.initialize();
    console.log('🌱 Starting seed...');
    const orgRepo = dataSource.getRepository(organization_entity_1.Organization);
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const customerRepo = dataSource.getRepository(customer_entity_1.Customer);
    const noteRepo = dataSource.getRepository(note_entity_1.Note);
    const logRepo = dataSource.getRepository(activity_log_entity_1.ActivityLog);
    await logRepo.query(`TRUNCATE activity_logs, notes, customers, users, organizations RESTART IDENTITY CASCADE`);
    const org = orgRepo.create({ name: 'Acme Corporation' });
    const savedOrg = await orgRepo.save(org);
    console.log(`✅ Organization: ${savedOrg.name} (${savedOrg.id})`);
    const hash = async (p) => bcrypt.hash(p, 12);
    const admin = userRepo.create({
        name: 'Admin User',
        email: 'admin@acme.com',
        password: await hash('Password123!'),
        role: user_role_enum_1.UserRole.ADMIN,
        organizationId: savedOrg.id,
    });
    const member1 = userRepo.create({
        name: 'Alice Member',
        email: 'alice@acme.com',
        password: await hash('Password123!'),
        role: user_role_enum_1.UserRole.MEMBER,
        organizationId: savedOrg.id,
    });
    const member2 = userRepo.create({
        name: 'Bob Member',
        email: 'bob@acme.com',
        password: await hash('Password123!'),
        role: user_role_enum_1.UserRole.MEMBER,
        organizationId: savedOrg.id,
    });
    const [savedAdmin, savedMember1, savedMember2] = await userRepo.save([
        admin,
        member1,
        member2,
    ]);
    console.log(`✅ Users created: admin, alice, bob`);
    const customerData = Array.from({ length: 20 }, (_, i) => ({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
        organizationId: savedOrg.id,
        assignedTo: i < 5
            ? savedMember1.id
            : i < 8
                ? savedMember2.id
                : null,
    }));
    const customers = customerRepo.create(customerData);
    const savedCustomers = await customerRepo.save(customers);
    console.log(`✅ 20 customers created`);
    await customerRepo.softDelete(savedCustomers[17].id);
    await customerRepo.softDelete(savedCustomers[18].id);
    await customerRepo.softDelete(savedCustomers[19].id);
    console.log(`✅ Soft-deleted customers 18, 19, 20`);
    const noteEntities = savedCustomers.slice(0, 5).map((c, i) => noteRepo.create({
        content: `Initial note for ${c.name} — follow up in Q${i + 1}`,
        customerId: c.id,
        organizationId: savedOrg.id,
        createdBy: i % 2 === 0 ? savedAdmin.id : savedMember1.id,
    }));
    await noteRepo.save(noteEntities);
    console.log(`✅ 5 notes created`);
    const logEntries = [
        ...savedCustomers.slice(0, 17).map((c) => logRepo.create({
            entityType: 'customer',
            entityId: c.id,
            action: activity_action_enum_1.ActivityAction.CUSTOMER_CREATED,
            performedBy: savedAdmin.id,
            organizationId: savedOrg.id,
        })),
        ...savedCustomers.slice(0, 5).map((c) => logRepo.create({
            entityType: 'customer',
            entityId: c.id,
            action: activity_action_enum_1.ActivityAction.CUSTOMER_ASSIGNED,
            performedBy: savedAdmin.id,
            organizationId: savedOrg.id,
        })),
        ...[17, 18, 19].map((idx) => logRepo.create({
            entityType: 'customer',
            entityId: savedCustomers[idx].id,
            action: activity_action_enum_1.ActivityAction.CUSTOMER_DELETED,
            performedBy: savedAdmin.id,
            organizationId: savedOrg.id,
        })),
        ...savedCustomers.slice(0, 5).map((c) => logRepo.create({
            entityType: 'customer',
            entityId: c.id,
            action: activity_action_enum_1.ActivityAction.NOTE_ADDED,
            performedBy: savedAdmin.id,
            organizationId: savedOrg.id,
        })),
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
//# sourceMappingURL=seed.js.map