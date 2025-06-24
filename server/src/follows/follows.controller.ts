import { Controller, Post, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Request() req, @Param('id') id: string): Promise<void> {
    await this.followsService.follow(req.user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/follow')
  async unfollow(@Request() req, @Param('id') id: string): Promise<void> {
    await this.followsService.unfollow(req.user.id, +id);
  }
}