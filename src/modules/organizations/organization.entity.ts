import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('organizations')
export class Organization {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  // Relations defined in child entities to avoid circular imports
  @OneToMany('User', 'organization')
  users: unknown[];

  @OneToMany('Customer', 'organization')
  customers: unknown[];
}
