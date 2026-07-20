import { Injectable, ConflictException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan path ini sesuai dengan letak PrismaService Anda

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    // Mengecek apakah NIM atau User ID sudah dipakai
    const existingStudent = await this.prisma.student.findFirst({
      where: {
        OR: [
          { nim: createStudentDto.nim },
          { userId: createStudentDto.userId },
        ],
      },
    });

    if (existingStudent) {
      throw new ConflictException('Data Mahasiswa dengan NIM atau User ID tersebut sudah terdaftar.');
    }

    // Menyimpan data mahasiswa baru
    return this.prisma.student.create({
      data: {
        nim: createStudentDto.nim,
        userId: createStudentDto.userId,
        gender: createStudentDto.gender,
        age: createStudentDto.age,
        attendanceRate: createStudentDto.attendanceRate,
        assignmentScore: createStudentDto.assignmentScore,
        discussionPart: createStudentDto.discussionPart,
      },
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      include: { user: true }, // Menampilkan juga data akun user-nya
    });
  }

  async findOne(id: string) {
    return this.prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: string, updateData: Partial<CreateStudentDto>) {
    return this.prisma.student.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.student.delete({
      where: { id },
    });
  }

}