import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDTO {
  @ApiProperty({ description: 'Event start date' })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ description: 'Event start end' })
  @IsString()
  @IsNotEmpty()
  end: string;

  @ApiProperty({ description: 'Google calendar title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Google maps location string' })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({ description: 'Google meet creation' })
  @IsBoolean()
  meet: boolean;

  @ApiProperty({ description: 'Meet event attendees emails' })
  @IsOptional()
  attendees: string[];
}

export class UpdateEventDTO {
  @ApiProperty({ description: 'Event ID' })
  @IsString()
  @IsNotEmpty()
  eventId?: string;

  @ApiProperty({ description: 'Event start date' })
  @IsString()
  @IsNotEmpty()
  start?: string;

  @ApiProperty({ description: 'Event start end' })
  @IsString()
  @IsNotEmpty()
  end?: string;

  @ApiProperty({ description: 'Google calendar title' })
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Google maps location string' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Google meet creation' })
  @IsBoolean()
  meet?: boolean;

  @ApiProperty({ description: 'Meet event attendees emails' })
  @IsOptional()
  attendees?: string[];
}

