import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User'; // Assuming User entity is defined
import { Restaurant } from './Restaurant'; // Assuming Restaurant entity is defined

@Entity()
export class Lead {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ 
    type: 'enum', 
    enum: ['new', 'contacted', 'interested', 'converted', 'inactive'], 
    default: 'new' 
  })
  status!: 'new' | 'contacted' | 'interested' | 'converted' | 'inactive';

  @Column({type: 'varchar', length: 255, nullable: false, default: ''})
  leadSource!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null; // New column for additional notes

  @Column({ type: 'date', nullable: true })
  followUpDate!: Date | null; // New column for the follow-up date

  @DeleteDateColumn()
  deletedDate!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.assignedLeads, { nullable: false, onDelete: 'SET NULL' }) // Assuming User has a one-to-many relationship with Lead
  keyAccountManager!: User; 

  @ManyToOne(() => User,(user) => user.createdLeads, {nullable: false ,onDelete: 'SET NULL'})
  createdBy!: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.leads, { nullable: true, onDelete: 'CASCADE' }) // Assuming Restaurant has a one-to-many relationship with Lead
  restaurant!: Restaurant;
}