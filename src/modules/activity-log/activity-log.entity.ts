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
import { User } from '../users/user.entity';
import { ActivityAction } from './enums/activity-action.enum';

@Entity('activity_logs')
@Index(['entityId', 'entityType'])
@Index(['organizationId'])
export class ActivityLog {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  entityType: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  entityId: string;

  @ApiProperty({ enum: ActivityAction })
  @Column({ type: 'enum', enum: ActivityAction })
  action: ActivityAction;

  @ApiProperty()
  @Column({ type: 'uuid' })
  performedBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedBy' })
  performedByUser: User;

  @ApiProperty()
  @Column({ type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ApiProperty()
  @CreateDateColumn()
  timestamp: Date;
}
