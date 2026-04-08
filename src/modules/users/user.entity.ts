import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../organizations/organization.entity';
import { UserRole } from './enums/user-role.enum';

@Entity('users')
@Index(['organizationId', 'email'], { unique: true })
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @ApiProperty()
  @Column({ type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
