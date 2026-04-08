import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';

@Entity('customers')
@Index(['organizationId', 'deletedAt'])
@Index(['organizationId', 'assignedTo'])
@Index(['name', 'email'])
export class Customer {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ApiPropertyOptional()
  @Column({ type: 'uuid', nullable: true })
  assignedTo: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedTo' })
  assignedUser: User | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional()
  @DeleteDateColumn()
  deletedAt: Date | null;
}
