import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  ManyToOne, 
  UpdateDateColumn, 
  DeleteDateColumn, 
  OneToOne
} from 'typeorm';
import { Lead } from './Lead'; 
import { User } from './User'; 
import { Contact } from './Contact';
import { Order } from './Order';
import { InteractionType, InteractionSubType, InteractionMethod, Outcome } from '@repo/schemas';

@Entity('interactions')
export class Interaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ 
    type: 'enum', 
    enum: InteractionType, 
    nullable: false 
  })
  interactionType!: InteractionType;

  // Subtype for better categorization
  @Column({ 
    type: 'enum', 
    enum: InteractionSubType, 
    nullable: true 
  })
  interactionSubtype!: InteractionSubType;

  // Interaction method
  @Column({ 
    type: 'enum', 
    enum: InteractionMethod, 
    nullable: false 
  })
  interactionMethod!: InteractionMethod;

  // Specific data for calls (e.g., duration in seconds)
  @Column({ type: 'int', nullable: true })
  callDuration!: number | null;

  // // Specific data for orders (e.g., total amount)
  // //TODO: Make it a seperate entity
  // @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  // orderAmount!: number | null;

  // Generic details field for any additional notes
  @Column({ type: 'text', nullable: true })
  details!: string;

  @Column({ type: 'timestamp', nullable: false })
  interactionDate!: Date;

  @OneToOne(() => Order, (order) => order.interaction)
  order!: Order;

  // User who made the interaction, it might be possible that the user is different from kam for a perticular interaction
  //TODO: Change the name of this to createdBy
  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' })
  user!: User;

  // Related lead
  @ManyToOne(() => Lead, (lead) => lead.interactions, { nullable: false, onDelete: 'CASCADE' })
  lead!: Lead;

  //The POC with which interaction happen
  @ManyToOne(() => Contact, (contact) => contact.interactions, {nullable: false, onDelete: 'CASCADE'})
  contact!: Contact;

  // Interaction outcome (e.g., positive, neutral, negative)
  @Column({ 
    type: 'enum', 
    enum: Outcome, 
    default: 'neutral',
    nullable: false 
  })
  outcome!: Outcome;

  @CreateDateColumn({select: false})
  created_at!: Date;

  @UpdateDateColumn({select: false})
  updatedAt!: Date;

  @DeleteDateColumn({select: false})
  deletedDate!: Date;
}
