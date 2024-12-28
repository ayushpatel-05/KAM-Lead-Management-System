import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Lead } from './Lead'; // Assuming Lead entity is defined

enum CallScheduleType {
  FIXED = 'fixed',
  CUSTOM = 'custom',
}

enum CallScheduleStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  MISSED = 'missed',
}

@Entity()
export class CallSchedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Lead, (lead) => lead.callSchedules, {nullable: false, onDelete: 'CASCADE'})
  lead!: Lead;

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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;
}