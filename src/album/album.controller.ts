import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { validate as isUuid } from 'uuid';
import { errorMessages } from '../helpers/constants';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.findAll();
  }

  @Get(':id')
  getAlbumById(@Param('id') id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    const track = this.albumService.findOne(id);
    if (!track) throw new NotFoundException(errorMessages.notFound('Album'));
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createTrackDto: CreateAlbumDto) {
    return this.albumService.create(createTrackDto);
  }

  @Put(':id')
  updateAlbum(@Param('id') id: string, @Body() updateTrackDto: UpdateAlbumDto) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    return this.albumService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(@Param('id') id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    this.albumService.remove(id);
  }
}
