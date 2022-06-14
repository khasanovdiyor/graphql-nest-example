import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  create(createAuthorInput: CreateAuthorInput) {
    const newAuthor = this.authorRepository.create(createAuthorInput);
    return this.authorRepository.save(newAuthor);
  }

  findAll(): Promise<Author[]> {
    return this.authorRepository.find({ relations: ['books'] });
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author is not found with id: ${id}`);
    }
    console.log(author);
    return author;
  }

  async update(
    id: number,
    updateAuthorInput: UpdateAuthorInput,
  ): Promise<Author> {
    const updatedAuthor = await this.authorRepository.preload({
      id,
      ...updateAuthorInput,
    });

    if (!updatedAuthor) {
      throw new NotFoundException(`Author is not found with id: ${id}`);
    }

    return this.authorRepository.save(updatedAuthor);
  }

  async remove(id: number) {
    const author = await this.findOne(id);
    return this.authorRepository.delete(author);
  }
}
