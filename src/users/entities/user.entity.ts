import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Note } from '../../notes/entities/note.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  hashed_password!: string;

  @OneToMany(() => Note, (note) => note.user)
  notes!: Note[];
}
