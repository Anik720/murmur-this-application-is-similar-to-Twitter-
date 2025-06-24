import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards, Query } from '@nestjs/common';
import { MurmursService } from './murmurs.service';
import { CreateMurmurDto } from './dtos/create-murmur.dto';
import { MurmurResponseDto } from './dtos/murmur-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class MurmursController {
  constructor(private murmursService: MurmursService) {}

 @UseGuards(JwtAuthGuard)
 @Get('murmurs')
 async getTimeline(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
) {
  const pageNumber = parseInt(page ?? '1', 10);
  const limitNumber = parseInt(limit ?? '10', 10);

  return this.murmursService.findTimeline(req.user.id, pageNumber, limitNumber);
}

  @UseGuards(JwtAuthGuard)
  @Post('me/murmurs')
  async create(@Request() req, @Body() createMurmurDto: CreateMurmurDto): Promise<MurmurResponseDto> {
    return this.murmursService.create(req.user.id, createMurmurDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/murmurs/:id')
  async delete(@Request() req, @Param('id') id: string): Promise<void> {
    await this.murmursService.delete(+id, req.user.id);
  }

  @Get('murmurs/:id')
  async getMurmur(@Param('id') id: string): Promise<MurmurResponseDto> {
    return this.murmursService.findOne(+id);
  }
}