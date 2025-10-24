import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, TaxRegion } from '@prisma/client';

@Controller('taxes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Get('templates')
  getTaxTemplates(@Query('region') region?: TaxRegion) {
    return this.taxesService.getTaxTemplates(region);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  create(@Body() createTaxDto: any) {
    return this.taxesService.create(createTaxDto);
  }

  @Get()
  findAll(
    @Query('tenantId') tenantId: string,
    @Query('region') region?: TaxRegion,
    @Query('country') country?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.taxesService.findAll(tenantId, {
      region,
      country,
      isActive: isActive === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  update(@Param('id') id: string, @Body() updateTaxDto: any) {
    return this.taxesService.update(id, updateTaxDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  delete(@Param('id') id: string) {
    return this.taxesService.delete(id);
  }

  @Post('calculate')
  calculateTax(@Body() dto: { amount: number; taxIds: string[] }) {
    return this.taxesService.calculateTax(dto.amount, dto.taxIds);
  }
}
