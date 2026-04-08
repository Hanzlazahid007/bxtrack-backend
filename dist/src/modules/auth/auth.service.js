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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const organization_entity_1 = require("../organizations/organization.entity");
const user_entity_1 = require("../users/user.entity");
const user_role_enum_1 = require("../users/enums/user-role.enum");
let AuthService = class AuthService {
    orgRepo;
    userRepo;
    jwtService;
    dataSource;
    constructor(orgRepo, userRepo, jwtService, dataSource) {
        this.orgRepo = orgRepo;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    async register(dto) {
        return this.dataSource.transaction(async (manager) => {
            const existingUser = await manager.findOne(user_entity_1.User, {
                where: { email: dto.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('A user with this email already exists');
            }
            const organization = manager.create(organization_entity_1.Organization, {
                name: dto.organizationName,
            });
            const savedOrg = await manager.save(organization);
            const hashedPassword = await bcrypt.hash(dto.password, 12);
            const user = manager.create(user_entity_1.User, {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
                role: user_role_enum_1.UserRole.ADMIN,
                organizationId: savedOrg.id,
            });
            const savedUser = await manager.save(user);
            const payload = {
                sub: savedUser.id,
                email: savedUser.email,
                organizationId: savedOrg.id,
                role: savedUser.role,
            };
            const accessToken = this.jwtService.sign(payload);
            return {
                accessToken,
                userId: savedUser.id,
                organizationId: savedOrg.id,
            };
        });
    }
    async login(dto) {
        const user = await this.userRepo
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: dto.email })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            organizationId: user.organizationId,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            userId: user.id,
            organizationId: user.organizationId,
            role: user.role,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        typeorm_2.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map