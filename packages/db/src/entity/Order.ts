import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Lead } from './Lead';
import { Interaction } from './Interaction';
import { User } from './User';
  
  @Entity('orders')
  export class Order {
    @PrimaryGeneratedColumn('uuid')
    id!: string;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    totalAmount!: number;
  
    @Column({ type: 'text', nullable: true })
    notes!: string;
  
    @Column({ type: 'timestamp', nullable: false })
    orderDate!: Date;
  
    // Related lead
    @ManyToOne(() => Lead, (lead) => lead.orders, { nullable: false, onDelete: 'CASCADE' })
    lead!: Lead;
    
    //Need to track the user who placed the order for tracking the user performace
    @ManyToOne(() => User, { nullable: false, onDelete: 'SET NULL' })
    user!: User;

    //Related interaction
    @OneToOne(() => Interaction, (interaction) => interaction.order, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn() // This marks the owning side of the relationship
    interaction!: Interaction | null;
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt!: Date;
  }
  