import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { GuestLoginDto } from './dto/guest-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async guestLogin(dto: GuestLoginDto) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const guestName = dto.name || 'Guest';
    const username = `guest_${randomSuffix}`;

    const user = await this.prisma.user.create({
      data: {
        fullName: guestName,
        username,
        isGuest: true,
      },
    });

    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isGuest: user.isGuest,
      },
    };
  }
}
