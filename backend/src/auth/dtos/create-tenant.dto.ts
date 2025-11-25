import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsPhoneNumber, IsOptional } from "class-validator";

export class CreateTenantDto {
  @ApiProperty({ example: "Vendura Ltd" })
  @IsString()
  businessName: string;

  @ApiProperty({ example: "Kayode " })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Adebajo" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "bajo@mailinator.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+2348164240882" })
  @IsPhoneNumber("NG")
  phone: string;

  @ApiPropertyOptional({ example: "vendura" })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: "Ijegun" })
  @IsString()
  plan: string;
}
