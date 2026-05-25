import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ default: false })
  is_completed!: boolean;

  @Column({ type: 'timestamp', nullable: true, default: null })
  deleted_at!: Date | null;

  @Column({ nullable: true })
  user_id!: number;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
