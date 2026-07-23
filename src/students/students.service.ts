import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateStudentDto) {
    try {
      const student = await this.prisma.student.create({
        data: {
          name: data.name,
          nim: data.nim,
          attendanceRate: data.attendanceRate ?? 100,
          assignmentScore: data.assignmentScore ?? 100,
          discussionPart: data.discussionPart ?? 10,
        },
      });

      return student;
    } catch (error: any) { // <-- PERBAIKAN: Tambahkan ': any' di sini
      if (error.code === 'P2002') {
        throw new ConflictException('NIM sudah terdaftar di database!');
      }
      throw new InternalServerErrorException('Gagal menyimpan data ke database');
    }
  }

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { createdAt: 'desc' } 
    });
  }

  // =======================================================
  // PERBAIKAN: Tambahan fungsi CRUD agar Controller tidak error
  // =======================================================
  
  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateStudentDto: any) {
    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }

  async remove(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }
}