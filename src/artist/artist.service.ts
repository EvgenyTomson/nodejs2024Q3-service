import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../database/prisma.service';
import { Artist } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist | undefined> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      return undefined;
    }
    return artist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const existingArtist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!existingArtist) {
      throw new NotFoundException(errorMessages.notFound('Artist'));
    }

    return this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });
  }

  async remove(id: string): Promise<void> {
    const existingArtist = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!existingArtist) {
      throw new NotFoundException(errorMessages.notFound('Artist'));
    }

    await this.prisma.artist.delete({ where: { id } });

    this.eventEmitter.emit('artist.deleted', id);
  }
}
