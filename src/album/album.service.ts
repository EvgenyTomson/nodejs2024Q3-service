import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../database/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('artist.deleted')
  handleArtistDeletedEvent(id: string) {
    this.nullifyArtistInAlbums(id);
  }

  onModuleInit() {
    this.eventEmitter.on(
      'artist.deleted',
      this.handleArtistDeletedEvent.bind(this),
    );
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album | undefined> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      return undefined;
    }
    return album;
  }

  async create(albumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: albumDto,
    });
  }

  async update(id: string, updateDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(errorMessages.notFound('Album'));
    }
    return this.prisma.album.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(errorMessages.notFound('Album'));
    }

    await this.prisma.album.delete({ where: { id } });

    this.eventEmitter.emit('album.deleted', id);
  }

  async nullifyArtistInAlbums(artistId: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
