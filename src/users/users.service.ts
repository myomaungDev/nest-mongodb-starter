import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('user') private readonly userRepo: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.userRepo.create(createUserDto);
      return await user.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{
    data: User[];
    total: number;
    limit: number;
    page: number;
    nextPage?: number;
    prevPage?: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.userRepo.find().skip(skip).limit(limit).exec();
      const total = await this.userRepo.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      return {
        data: users,
        total: total,
        limit: limit,
        page: page,
        nextPage: nextPage,
        prevPage: prevPage,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepo.findById(id);
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findByUserNameOrEmail(query: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ]
      }).select('password');
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepo
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
          runValidators: true,
        })
        .exec();
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.userRepo.findByIdAndDelete(id).exec();
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
