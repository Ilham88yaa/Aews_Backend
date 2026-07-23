import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';

@Injectable()
export class PredictionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPredictionDto: CreatePredictionDto) {
    // 1. Ambil data akademik mahasiswa dari database
    const student = await this.prisma.student.findUnique({
      where: { id: createPredictionDto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Data mahasiswa tidak ditemukan');
    }

    // 2. Siapkan format data (Payload) sesuai permintaan FastAPI
    const mlPayload = {
      attendanceRate: student.attendanceRate,
      assignmentScore: student.assignmentScore,
      discussionPart: student.discussionPart,
    };


    try {
      // 3. Tembak Data ke Machine Learning Service (FastAPI)
      const mlResponse = await fetch('http://127.0.0.1:8001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mlPayload),
      });

      if (!mlResponse.ok) {
        // Tangkap pesan error spesifik dari Python
        const errorDetail = await mlResponse.text(); 
        throw new Error(`Error dari Python: ${errorDetail}`);
      }

      // 4. Tangkap hasil prediksi dari Python
      const mlData = await mlResponse.json();
      const predictionResult = mlData.prediction;

      // 5. Simpan Hasil Prediksi ke PostgreSQL via Prisma
      return this.prisma.prediction.create({
        data: {
          studentId: createPredictionDto.studentId,
          riskLevel: predictionResult.riskLevel,
          probability: predictionResult.probability,
          academicHealthScore: 0, // Nilai default sementara
          dominantFactors: predictionResult.dominantFactors, // Menyimpan feature importance
          
          // Menyimpan rekomendasi awal (Bisa dikembangkan lebih lanjut)
          recommendations: {
            create: [
              { message: `Hasil Analisis Sistem: Fokus pada peningkatan ${predictionResult.dominantFactors.join(' dan ')}.` }
            ]
          }
        },
      });

    } catch (error: any) {
      throw new InternalServerErrorException('Gagal memproses prediksi: ' + error.message);
    }
  }

  // ... (biarkan fungsi findAll dan findByStudent tetap seperti sebelumnya)
  
  async findAll() {
    return this.prisma.prediction.findMany({
      include: { student: true, recommendations: true },
    });
  }

  async findByStudent(studentId: string) {
    return this.prisma.prediction.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: { recommendations: true }
    });
  }
}