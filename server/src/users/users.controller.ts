import { Controller, Get, Param, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getOwnProfile(@Request() req): Promise<UserResponseDto> {
    return this.usersService.getProfile(req.user.id);
  }
  @Get('search')
  async searchUsers(@Query('query') query: string): Promise<UserResponseDto[]> {
    return this.usersService.searchUsers(query);
  }
  
  @Get(':id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.getProfile(id);
  }


}