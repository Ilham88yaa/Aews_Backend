import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string; // <-- Pastikan baris ini ada

  @IsString()
  @IsNotEmpty()
  nim: string;

  @IsNumber()
  @IsOptional()
  attendanceRate?: number;

  @IsNumber()
  @IsOptional()
  assignmentScore?: number;

  @IsNumber()
  @IsOptional()
  discussionPart?: number;
}