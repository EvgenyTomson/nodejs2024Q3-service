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
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { validate as isUuid } from 'uuid';
import { errorMessages } from '../helpers/constants';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.findAll();
  }

  @Get(':id')
  getArtistById(@Param('id') id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    const artist = this.artistService.findOne(id);
    if (!artist) throw new NotFoundException(errorMessages.notFound('Artist'));
    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteArtist(@Param('id') id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);
    this.artistService.remove(id);
  }
}
