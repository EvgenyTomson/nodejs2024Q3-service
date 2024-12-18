import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './album.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

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

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    return this.albums.find((album) => album.id === id);
  }

  create(albumDto: CreateAlbumDto) {
    const newTrack: Album = { id: uuidv4(), ...albumDto };
    this.albums.push(newTrack);
    return newTrack;
  }

  update(id: string, updateDto: UpdateAlbumDto) {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1)
      throw new NotFoundException(errorMessages.notFound('Album'));
    this.albums[albumIndex] = { ...this.albums[albumIndex], ...updateDto };
    return this.albums[albumIndex];
  }

  remove(id: string) {
    const albumIndex = this.albums.findIndex((album) => album.id === id);
    if (albumIndex === -1)
      throw new NotFoundException(errorMessages.notFound('Album'));
    this.albums.splice(albumIndex, 1);

    this.eventEmitter.emit('album.deleted', id);
  }

  nullifyArtistInAlbums(artistId: string) {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }
}
