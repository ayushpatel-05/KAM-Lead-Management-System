import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Lead } from './Lead'; // Assuming Lead entity is defined
import { Contact } from './Contact';
import { CallScheduleType, CallScheduleStatus, CallIntent } from '@repo/schemas';

@Entity("call_schedules")
export class CallSchedule {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  //For now only fixed option should be used
  @Column({
    type: 'enum',
    enum: CallScheduleType,
    default: CallScheduleType.FIXED,
  })
  type!: CallScheduleType;

  @Column({ type: 'timestamp', nullable: false })
  datetime!: Date;
  
  @Column({
    type: 'enum',
    enum: CallScheduleStatus,
    default: CallScheduleStatus.SCHEDULED,
  })
  status!: CallScheduleStatus;
  
  @Column({
    type: 'enum',
    enum: CallIntent,
    nullable: false,
  })
  intent!: CallIntent;
  
  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({type: 'varchar', nullable: true})
  otherIntent!: string | null;
  
  @ManyToOne(() => Lead, (lead) => lead.callSchedules, {nullable: false, onDelete: 'CASCADE'})
  lead!: Lead;

  @ManyToOne(() => Contact, (contact) => contact.callSchedules , { nullable: false, onDelete: 'CASCADE' })
  contact!: Contact;

  @CreateDateColumn({select: false})
  createdAt!: Date;

  @UpdateDateColumn({select: false})
  updatedAt!: Date;

  @DeleteDateColumn({select: false})
  deletedDate!: Date;
}