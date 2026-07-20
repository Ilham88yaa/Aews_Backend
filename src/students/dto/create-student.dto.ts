import { IsString, IsInt, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  nim: string; // Tetap butuh untuk identitas akademik, walau tidak masuk ke model ML

  @IsNotEmpty()
  @IsString()
  userId: string; // ID dari akun user (mahasiswa) yang sudah dibuat sebelumnya

  @IsNotEmpty()
  @IsString()
  gender: string; // 'Laki-laki' atau 'Perempuan'

  @IsNotEmpty()
  @IsInt()
  @Min(15)
  @Max(60)
  age: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  attendanceRate: number; // Kehadiran (%)

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  assignmentScore: number; // Nilai Tugas Rata-rata

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discussionPart: number; // Partisipasi Diskusi Rata-rata
}