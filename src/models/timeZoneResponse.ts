import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TimeZoneModel {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tzCode: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  utc: string;
  @ApiProperty()
  @IsString()
  label?: string;
  @ApiProperty()
  @IsString()
  name?: string;
}
