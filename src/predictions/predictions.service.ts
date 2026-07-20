import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';

@Injectable()
export class PredictionsService {
  constructor(private prisma: PrismaService) {}

  // Menyimpan hasil prediksi dari Machine Learning
  async create(createPredictionDto: CreatePredictionDto) {
    return this.prisma.prediction.create({
      data: {
        studentId: createPredictionDto.studentId,
        
        // Sesuaikan dengan nama kolom yang ada di model Prediction
        riskLevel: createPredictionDto.riskStatus, 
        probability: createPredictionDto.confidenceScore,
        academicHealthScore: 0, // Karena di schema wajib diisi (tidak ada tanda '?'), kita beri nilai default dulu
        
        // Menyimpan string ke dalam tabel relasi Recommendation
        recommendations: createPredictionDto.recommendations 
          ? {
              create: [
                { message: createPredictionDto.recommendations } // <-- Ubah menjadi 'message'
              ]
            }
          : undefined,
      },
    });
  }

  // Mengambil semua data prediksi
  async findAll() {
    return this.prisma.prediction.findMany({
      include: { 
        student: true,
        recommendations: true // Tarik juga data rekomendasinya biar muncul saat di-GET
      }, 
    });
  }

  // Mengambil riwayat prediksi untuk 1 mahasiswa spesifik
  async findByStudent(studentId: string) {
    return this.prisma.prediction.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: { recommendations: true }
    });
  }
}