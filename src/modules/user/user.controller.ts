import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { omit } from 'lodash';
import { GenInitUserDto } from './dto/gen-init-user.dto';

@Controller('api/v1/user')
@ApiTags('User APIs')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const user: UserEntity & CreateUserDto = await this.userService.create(
      createUserDto,
    );
    return { id: user.id };
  }

  @Post('create-and-gen-schedule')
  // @UseGuards(JwtAuthGuard)
  async genInit(@Body() initDto: GenInitUserDto) {
    const user: UserEntity & GenInitUserDto =
      await this.userService.createAndGenSchedule(initDto);
    return { id: user.id };
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    const result = omit(user, ['password']);
    return result;
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
