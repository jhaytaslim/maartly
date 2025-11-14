import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsEmail, IsPhoneNumber, IsOptional } from "class-validator";

export class CreateSupplierDto {
  @ApiProperty({ example: "Adebajo Industries" })
  @IsString()
  name: string;

  @ApiProperty({ example: "bajo@mailinator.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+2348164240882" })
  @IsPhoneNumber("NG")
  phone: string;

  @ApiPropertyOptional({ example: "1 Alh. Adiatu close, awotile" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: "Ijegun" })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiPropertyOptional({
    example: "671b39d812cdd1b9e07d64a2",
    description: "Tenant ID",
  })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
