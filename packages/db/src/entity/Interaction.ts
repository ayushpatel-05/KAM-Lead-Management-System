import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  ManyToOne, 
  UpdateDateColumn, 
  DeleteDateColumn 
} from 'typeorm';
import { Lead } from './Lead'; 
import { User } from './User'; 
import { Restaurant } from './Restaurant';
import { Contact } from './Contact';

@Entity('interactions')
export class Interaction {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column({ 
    type: 'enum', 
    enum: ['call', 'order'], 
    nullable: false 
  })
  interactionType!: 'call' | 'order';

  // Subtype for better categorization
  @Column({ 
    type: 'enum', 
    enum: ['initial', 'follow-up', 'feedback', 'new order', 'repeat order'], 
    nullable: true 
  })
  interactionSubtype!: 'initial' | 'follow-up' | 'feedback' | 'new order' | 'repeat order';

  // Interaction method
  @Column({ 
    type: 'enum', 
    enum: ['phone', 'email', 'chat', 'in-person'], 
    nullable: false 
  })
  interactionMethod!: 'phone' | 'email' | 'chat' | 'in-person';

  // Specific data for calls (e.g., duration in seconds)
  @Column({ type: 'int', nullable: true })
  callDuration!: number | null;

  // Specific data for orders (e.g., total amount)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  orderAmount!: number | null;

  // Generic details field for any additional notes
  @Column({ type: 'text', nullable: true })
  details!: string;

  @Column({ type: 'timestamp', nullable: false })
  interactionDate!: Date;

  // User who made the interaction, it might be possible that the user is different from kam for a perticular interaction
  @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' })
  user!: User;

  // Related lead
  @ManyToOne(() => Lead, (lead) => lead.interactions, { nullable: false, onDelete: 'CASCADE' })
  lead!: Lead;

  //The POC with which interaction happen
  @ManyToOne(() => Contact, (contact) => contact.interactions, {nullable: false, onDelete: 'CASCADE'})
  contact!: Contact;
  // // Optional association with Restaurant
  // @ManyToOne(() => Restaurant, (restaurant) => restaurant.interactions, { nullable: true })
  // restaurant!: Restaurant | null;

  // Interaction outcome (e.g., positive, neutral, negative)
  @Column({ 
    type: 'enum', 
    enum: ['positive', 'neutral', 'negative'], 
    nullable: true 
  })
  outcome!: 'positive' | 'neutral' | 'negative' | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedDate!: Date;
}
