import { Transform } from 'class-transformer';
import {
  Equals,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class WaitlistDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;
  @IsIn(['monthly', 'annual']) plan: 'monthly' | 'annual';
  @Transform(({ obj }) => obj.consent === true)
  @Equals(true, {
    message: 'Please consent to being contacted about Pro availability.',
  })
  consent: boolean;
  @IsOptional() @IsString() @MaxLength(0) website?: string;
}
export class ContactDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email: string;
  @IsIn(['support', 'bug', 'feedback', 'university', 'privacy'])
  category: string;
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;
  @Transform(({ obj }) => obj.consent === true)
  @Equals(true, { message: 'Please acknowledge the privacy notice.' })
  consent: boolean;
  @IsOptional() @IsString() @MaxLength(0) website?: string;
}
