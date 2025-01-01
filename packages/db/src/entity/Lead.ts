import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User'; // Assuming User entity is defined
import { Restaurant } from './Restaurant'; // Assuming Restaurant entity is defined
import { Contact } from './Contact';
import { Interaction } from './Interaction';
import { CallSchedule } from './CallSchedule';

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

  // @Column({ type: 'date', nullable: true })//Do not need it since we have CallSchedule entity
  // followUpDate!: Date | null; // New column for the follow-up date

  @DeleteDateColumn({select: false})
  deletedDate!: Date;

  @CreateDateColumn({select: false})
  createdAt!: Date;

  @UpdateDateColumn({select: false})
  updatedAt!: Date;

  
  @ManyToOne(() => User, (user) => user.assignedLeads, { nullable: false, onDelete: 'SET NULL' }) // Assuming User has a one-to-many relationship with Lead
  keyAccountManager!: User; 
  
  @ManyToOne(() => User,(user) => user.createdLeads, {nullable: false ,onDelete: 'SET NULL'})
  createdBy!: User;
  
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.leads, { nullable: true, onDelete: 'CASCADE' }) // Assuming Restaurant has a one-to-many relationship with Lead
  restaurant!: Restaurant;
  
  @OneToMany(() => Contact, (contact) => contact.lead, {cascade: ["insert", "update", "remove", "soft-remove", "recover"]})
  contacts!: Contact[];
  
  @OneToMany(() => CallSchedule,(callschedule) => callschedule.lead, {cascade: ["insert", "update", "remove", "soft-remove", "recover"]})
  callSchedules!: CallSchedule[];

  @OneToMany(() => Interaction, (interaction) => interaction.lead, {nullable: false, cascade: ["insert", "update", "remove", "soft-remove", "recover"]})
  interactions!: Interaction[];

}