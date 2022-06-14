import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Author } from 'src/authors/entities/author.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['authorId', 'title'])
@ObjectType()
export class Book {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => ID)
  authorId: number;

  @ManyToOne(() => Author, (author) => author.books, {
    eager: true,
  })
  @Field(() => Author)
  author: Author;
}
