import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../database/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('artist.deleted')
  handleArtistDeletedEvent(id: string) {
    this.nullifyArtistInTracks(id);
  }

  @OnEvent('album.deleted')
  handleAlbumDeletedEvent(id: string) {
    this.nullifyAlbumInTracks(id);
  }

  onModuleInit() {
    this.eventEmitter.on(
      'artist.deleted',
      this.handleArtistDeletedEvent.bind(this),
    );
    this.eventEmitter.on(
      'album.deleted',
      this.handleAlbumDeletedEvent.bind(this),
    );
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track | undefined> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      return undefined;
    }
    return track;
  }

  async create(trackDto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: trackDto,
    });
  }

  async update(id: string, updateDto: UpdateTrackDto): Promise<Track> {
    const existingTrack = await this.findOne(id);
    if (!existingTrack) {
      throw new NotFoundException(errorMessages.notFound('Track'));
    }

    return this.prisma.track.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!track) {
      throw new NotFoundException(errorMessages.notFound('Track'));
    }

    await this.prisma.track.delete({ where: { id } });

    this.eventEmitter.emit('track.deleted', id);
  }

  async nullifyArtistInTracks(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async nullifyAlbumInTracks(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
