import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Buka komentar ini jika JWT Guard sudah siap

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // Endpoint untuk membuat data mahasiswa
  // @UseGuards(JwtAuthGuard) // Buka komentar ini nanti untuk memproteksi endpoint
  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // Endpoint untuk mengambil seluruh data mahasiswa
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }
}