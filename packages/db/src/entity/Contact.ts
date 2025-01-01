import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Lead } from './Lead';
import { Interaction } from './Interaction';
import { CallSchedule } from './CallSchedule';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  
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
  
  @Column({ type: 'varchar', length: 50, nullable: false })
  timezone!: string | null;

  @ManyToOne(() => Lead, (lead) => lead.contacts, { nullable: true, onDelete: 'CASCADE' }) 
  lead!: Lead;

  @OneToMany(() => Interaction, (interaction) => interaction.contact)
  interactions!: Interaction[];

  @OneToMany(() => CallSchedule, (callSchedule) => callSchedule.contact)
  callSchedules!: CallSchedule[];

  @DeleteDateColumn({select: false})
  deletedDate!: Date

  @UpdateDateColumn({select: false})
  updatedAt!: Date;

  @CreateDateColumn({select: false})
  created_at!: Date;
}