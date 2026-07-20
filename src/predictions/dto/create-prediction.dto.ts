import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePredictionDto {
  @IsNotEmpty()
  @IsString()
  studentId: string; // ID dari tabel Student yang baru saja Anda buat

  @IsNotEmpty()
  @IsString()
  riskStatus: string; // Contoh: 'Tinggi', 'Sedang', 'Rendah'

  @IsNotEmpty()
  @IsNumber()
  confidenceScore: number; // Tingkat akurasi model ML (0 - 100)

  @IsOptional()
  @IsString()
  recommendations?: string; // Saran intervensi dari sistem
}