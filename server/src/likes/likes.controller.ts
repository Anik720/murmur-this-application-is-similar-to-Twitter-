import { Controller, Post, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/murmurs')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@Request() req, @Param('id') id: string): Promise<void> {
    await this.likesService.like(req.user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlike(@Request() req, @Param('id') id: string): Promise<void> {
    await this.likesService.unlike(req.user.id, +id);
  }
}