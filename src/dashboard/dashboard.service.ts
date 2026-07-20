import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    // 1. Menghitung Total Mahasiswa
    const totalStudents = await this.prisma.student.count();

    // 2. Menghitung Rata-rata Metrik Akademik Seluruh Mahasiswa
    const averageStats = await this.prisma.student.aggregate({
      _avg: {
        attendanceRate: true,
        assignmentScore: true,
        discussionPart: true,
      },
    });

    // 3. Menghitung Distribusi Risiko dari tabel Prediksi
    const riskDistribution = await this.prisma.prediction.groupBy({
      by: ['riskLevel'],
      _count: {
        riskLevel: true,
      },
    });

    // Merapikan format distribusi risiko agar mudah dibaca oleh Frontend (React)
    const formattedRisk = {
      Rendah: 0,
      Sedang: 0,
      Tinggi: 0,
    };

    riskDistribution.forEach((item) => {
      if (formattedRisk[item.riskLevel] !== undefined) {
        formattedRisk[item.riskLevel] = item._count.riskLevel;
      }
    });

    // 4. Menggabungkan semua data untuk dikirim ke Frontend
    return {
      totalStudents,
      averages: {
        attendance: averageStats._avg.attendanceRate || 0,
        assignment: averageStats._avg.assignmentScore || 0,
        discussion: averageStats._avg.discussionPart || 0,
      },
      riskDistribution: formattedRisk,
    };
  }
}