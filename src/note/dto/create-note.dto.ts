import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateNoteDto {
  @ValidateIf((dto: CreateNoteDto) => dto.Title === undefined)
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ValidateIf((dto: CreateNoteDto) => dto.title === undefined)
  @IsString()
  @IsNotEmpty()
  Title?: string;

  @ValidateIf((dto: CreateNoteDto) => dto.Content === undefined)
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ValidateIf((dto: CreateNoteDto) => dto.content === undefined)
  @IsString()
  @IsNotEmpty()
  Content?: string;
}
