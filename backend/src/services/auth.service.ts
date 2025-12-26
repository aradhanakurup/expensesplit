import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async requestOTP(phone: string): Promise<{ success: boolean }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // In production: send via SMS (Twilio/AWS SNS)
    console.log(`OTP for ${phone}: ${otp}`);
    // Store in Redis with 5-minute TTL
    return { success: true };
  }

  async verifyOTP(phone: string, otp: string): Promise<{ token: string }> {
    // Verify OTP from Redis (implementation depends on cache service)
    const token = this.jwtService.sign(
      { phone, sub: phone },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '7d' },
    );
    return { token };
  }

  async validateToken(token: string): Promise<{ phone: string }> {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
    return { phone: decoded.phone };
  }
}
