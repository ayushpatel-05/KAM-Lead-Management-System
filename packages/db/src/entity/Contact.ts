import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Lead } from './Lead';
import { Interaction } from './Interaction';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  contact_id!: number;
  
  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;
  
  //Can it be an enum?
  @Column({ type: 'varchar', length: 100, nullable: true })
  role!: string;
  
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;
  
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;
  
  @ManyToOne(() => Lead, (lead) => lead.contacts, { nullable: true, onDelete: 'CASCADE' }) 
  lead!: Lead;

  @OneToMany(() => Interaction, (interaction) => interaction.contact)
  interactions!: Interaction[];

//   @ManyToOne(() => Restaurant, (restaurant) => restaurant.contacts, { nullable: true }) 
//   restaurant_id!: Restaurant;

  @DeleteDateColumn()
  deletedDate!: Date

  @UpdateDateColumn()
  updatedAt!: Date;

  @CreateDateColumn()
  created_at!: Date;
}