import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Address } from './Address';
import { Lead } from './Lead';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @OneToOne(() => Address, { cascade: ["insert", "update", "remove", "soft-remove", "recover"], nullable: true, onDelete: 'CASCADE' })
  @JoinColumn() // This creates a foreign key column `addressId` in the `Restaurant` table
  address!: Address | null;
  
  //Added by(TODO: Change the name of field later)
  @ManyToOne(() => User, (user) => user.restaurants, {onDelete: 'SET NULL'})
  user!: User;

  //Lead cooresponding to the restaurant. A single user can have multiple leads(Assumption)
  @OneToMany(() => Lead, (lead) => lead.restaurant)
  leads!: Lead[];

  @DeleteDateColumn()
  deletedDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
//Will restaurant require a contact as well?