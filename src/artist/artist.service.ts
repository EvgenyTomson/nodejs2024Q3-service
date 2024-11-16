import { Injectable, NotFoundException } from '@nestjs/common';
// import { Artist } from './artist.interface';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
// import { v4 as uuidv4 } from 'uuid';
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

  // findAll() {
  //   return this.artists;
  // }
  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  // findOne(id: string): Artist | undefined {
  //   const artist = this.artists.find((a) => a.id === id);
  //   if (!artist) return;

  //   return artist;
  // }
  async findOne(id: string): Promise<Artist | undefined> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      return undefined;
    }
    return artist;
  }

  // create(createArtistDto: CreateArtistDto) {
  //   const newArtist: Artist = {
  //     id: uuidv4(),
  //     name: createArtistDto.name,
  //     grammy: createArtistDto.grammy,
  //   };
  //   this.artists.push(newArtist);

  //   return newArtist;
  // }
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
  }

  // update(id: string, updateArtistDto: UpdateArtistDto): Artist {
  //   const artistIndex = this.artists.findIndex((a) => a.id === id);
  //   if (artistIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Artist'));

  //   this.artists[artistIndex] = {
  //     ...this.artists[artistIndex],
  //     ...updateArtistDto,
  //   };

  //   return this.artists[artistIndex];
  // }
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

  // remove(id: string): void {
  //   const artistIndex = this.artists.findIndex((a) => a.id === id);
  //   if (artistIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Artist'));

  //   this.artists.splice(artistIndex, 1);

  //   this.eventEmitter.emit('artist.deleted', id);
  // }
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

  // private artists: Artist[] = [];

  // constructor(private eventEmitter: EventEmitter2) {}

  // findAll() {
  //   return this.artists;
  // }

  // findOne(id: string): Artist | undefined {
  //   const artist = this.artists.find((a) => a.id === id);
  //   if (!artist) return;

  //   return artist;
  // }

  // create(createArtistDto: CreateArtistDto) {
  //   const newArtist: Artist = {
  //     id: uuidv4(),
  //     name: createArtistDto.name,
  //     grammy: createArtistDto.grammy,
  //   };
  //   this.artists.push(newArtist);

  //   return newArtist;
  // }

  // update(id: string, updateArtistDto: UpdateArtistDto): Artist {
  //   const artistIndex = this.artists.findIndex((a) => a.id === id);
  //   if (artistIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Artist'));

  //   this.artists[artistIndex] = {
  //     ...this.artists[artistIndex],
  //     ...updateArtistDto,
  //   };

  //   return this.artists[artistIndex];
  // }

  // remove(id: string): void {
  //   const artistIndex = this.artists.findIndex((a) => a.id === id);
  //   if (artistIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Artist'));

  //   this.artists.splice(artistIndex, 1);

  //   this.eventEmitter.emit('artist.deleted', id);
  // }
}
