import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly booksRepository: Repository<Book>,
  ) {}

  async create(createBookInput: CreateBookInput) {
    const newBook = this.booksRepository.create(createBookInput);
    try {
      const book = await this.booksRepository.save(newBook);
      return book;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Book with this title already exists!');
      }
    }
  }

  findAll() {
    return this.booksRepository.find();
  }

  async findOne(id: number) {
    const book = await this.booksRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book is not found with id: ${id}`);
    }

    return book;
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const updatedBook = await this.booksRepository.preload({
      id,
      ...updateBookInput,
    });

    if (!updatedBook) {
      throw new NotFoundException(`Book is not found with id: ${id}`);
    }

    return this.booksRepository.save(updatedBook);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    return this.booksRepository.remove(book);
  }
}
