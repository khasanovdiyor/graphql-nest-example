import { CreateBookInput } from './create-book.input';
import { InputType, Field, Int, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateBookInput extends OmitType(CreateBookInput, ['authorId']) {
  @Field(() => Int)
  id: number;
}
