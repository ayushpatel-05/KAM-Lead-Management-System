import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Address } from './Address';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @OneToOne(() => Address, { cascade: ["insert", "update", "remove", "soft-remove", "recover"], nullable: true, onDelete: 'CASCADE' })
  @JoinColumn() // This creates a foreign key column `addressId` in the `Restaurant` table
  address!: Address | null;

  @ManyToOne(() => User, (user) => user.restaurants, {onDelete: 'SET NULL'})
  user!: User;

  @DeleteDateColumn()
  deletedDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}