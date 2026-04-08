import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '../organizations/organization.entity';
import { User } from '../users/user.entity';
import { Customer } from '../customers/customer.entity';

@Entity('notes')
export class Note {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ApiProperty()
  @Column({ type: 'uuid' })
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ApiProperty()
  @Column({ type: 'uuid' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @ApiProperty()
  @Column({ type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
