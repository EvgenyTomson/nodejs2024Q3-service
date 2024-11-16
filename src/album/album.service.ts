import { Injectable, NotFoundException } from '@nestjs/common';
// import { Album } from './album.interface';
// import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../database/prisma.service';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumService {
  // private albums: Album[] = [];

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

  // findAll() {
  //   return this.albums;
  // }
  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  // findOne(id: string) {
  //   return this.albums.find((album) => album.id === id);
  // }
  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(errorMessages.notFound('Album'));
    }
    return album;
  }

  // create(albumDto: CreateAlbumDto) {
  //   const newTrack: Album = { id: uuidv4(), ...albumDto };
  //   this.albums.push(newTrack);
  //   return newTrack;
  // }
  async create(albumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: albumDto,
    });
  }

  // update(id: string, updateDto: UpdateAlbumDto) {
  //   const albumIndex = this.albums.findIndex((album) => album.id === id);
  //   if (albumIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Album'));
  //   this.albums[albumIndex] = { ...this.albums[albumIndex], ...updateDto };
  //   return this.albums[albumIndex];
  // }
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

  // remove(id: string) {
  //   const albumIndex = this.albums.findIndex((album) => album.id === id);
  //   if (albumIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Album'));
  //   this.albums.splice(albumIndex, 1);

  //   this.eventEmitter.emit('album.deleted', id);
  // }
  async remove(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException(errorMessages.notFound('Album'));
    }

    await this.prisma.album.delete({
      where: { id },
    });

    this.eventEmitter.emit('album.deleted', id);
  }

  // nullifyArtistInAlbums(artistId: string) {
  //   this.albums = this.albums.map((album) =>
  //     album.artistId === artistId ? { ...album, artistId: null } : album,
  //   );
  // }
  async nullifyArtistInAlbums(artistId: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  // private albums: Album[] = [];

  // constructor(private eventEmitter: EventEmitter2) {}

  // @OnEvent('artist.deleted')
  // handleArtistDeletedEvent(id: string) {
  //   this.nullifyArtistInAlbums(id);
  // }

  // onModuleInit() {
  //   this.eventEmitter.on(
  //     'artist.deleted',
  //     this.handleArtistDeletedEvent.bind(this),
  //   );
  // }

  // findAll() {
  //   return this.albums;
  // }

  // findOne(id: string) {
  //   return this.albums.find((album) => album.id === id);
  // }

  // create(albumDto: CreateAlbumDto) {
  //   const newTrack: Album = { id: uuidv4(), ...albumDto };
  //   this.albums.push(newTrack);
  //   return newTrack;
  // }

  // update(id: string, updateDto: UpdateAlbumDto) {
  //   const albumIndex = this.albums.findIndex((album) => album.id === id);
  //   if (albumIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Album'));
  //   this.albums[albumIndex] = { ...this.albums[albumIndex], ...updateDto };
  //   return this.albums[albumIndex];
  // }

  // remove(id: string) {
  //   const albumIndex = this.albums.findIndex((album) => album.id === id);
  //   if (albumIndex === -1)
  //     throw new NotFoundException(errorMessages.notFound('Album'));
  //   this.albums.splice(albumIndex, 1);

  //   this.eventEmitter.emit('album.deleted', id);
  // }

  // nullifyArtistInAlbums(artistId: string) {
  //   this.albums = this.albums.map((album) =>
  //     album.artistId === artistId ? { ...album, artistId: null } : album,
  //   );
  // }
}
