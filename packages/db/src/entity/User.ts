import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Restaurant } from "./Restaurant";
import { Lead } from "./Lead";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstName!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastName!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email!: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  password!: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'kam', 'sales'],
    default: 'kam',
  })
  role!: 'admin' | 'kam' | 'sales';

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user)
  restaurants!: Restaurant[];

  @OneToMany(() => Lead, (lead) => lead.keyAccountManager)
  assignedLeads!: Lead[];

  @OneToMany(() => Lead, (lead) => lead.createdBy)
  createdLeads!: Lead[];

  // @Column({ type: 'boolean', default: false })
  // is_deleted!: boolean;
  //Using typeorm in-build feature for soft deletion
  @DeleteDateColumn()
  deletedDate!: Date

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}