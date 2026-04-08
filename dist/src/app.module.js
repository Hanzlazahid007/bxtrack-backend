"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const customers_module_1 = require("./modules/customers/customers.module");
const notes_module_1 = require("./modules/notes/notes.module");
const activity_log_module_1 = require("./modules/activity-log/activity-log.module");
const organization_entity_1 = require("./modules/organizations/organization.entity");
const user_entity_1 = require("./modules/users/user.entity");
const customer_entity_1 = require("./modules/customers/customer.entity");
const note_entity_1 = require("./modules/notes/note.entity");
const activity_log_entity_1 = require("./modules/activity-log/activity-log.entity");
const logging_middleware_1 = require("./common/middleware/logging.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logging_middleware_1.LoggingMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'postgres'),
                    database: configService.get('DB_NAME', 'crm_db'),
                    entities: [organization_entity_1.Organization, user_entity_1.User, customer_entity_1.Customer, note_entity_1.Note, activity_log_entity_1.ActivityLog],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            customers_module_1.CustomersModule,
            notes_module_1.NotesModule,
            activity_log_module_1.ActivityLogModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map