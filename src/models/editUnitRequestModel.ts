import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UnitEditRequest {
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: true })
  @IsOptional()
  driverSignature?: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  vehicleId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  headOfficeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  homeTerminalAddressId: string;

  @ApiProperty()
  @IsOptional()
  trailerNumber: string;

  @ApiProperty()
  @IsOptional()
  shipingDocument: string;

  imageKey?: string;
  imageName?: string;
}
