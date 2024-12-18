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
import { TrackService } from './track.service';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { validate as isUuid } from 'uuid';
import { errorMessages } from '../helpers/constants';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.findAll();
  }

  @Get(':id')
  getTrackById(@Param('id') id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    const track = this.trackService.findOne(id);
    if (!track) throw new NotFoundException(errorMessages.notFound('Track'));
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Put(':id')
  updateTrack(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTrack(@Param('id') id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    this.trackService.remove(id);
  }
}
