import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePredictionDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  // Jadikan opsional karena sekarang diisi otomatis oleh ML Service
  @IsOptional()
  @IsString()
  riskStatus?: string; 

  @IsOptional()
  @IsNumber()
  confidenceScore?: number;
  
  // Jika di file Anda ada riskLevel atau probability, tambahkan @IsOptional() juga
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsNumber()
  probability?: number;
}