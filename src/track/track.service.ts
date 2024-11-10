import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './track.interface';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto, UpdateTrackDto } from './dto/track.dto';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  constructor(private eventEmitter: EventEmitter2) {}

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

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  create(trackDto: CreateTrackDto): Track {
    const newTrack: Track = { id: uuidv4(), ...trackDto };
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateDto: UpdateTrackDto): Track {
    const trackIndex = this.tracks.findIndex((track) => track.id === id);
    if (trackIndex === -1)
      throw new NotFoundException(errorMessages.notFound('Track'));
    this.tracks[trackIndex] = { ...this.tracks[trackIndex], ...updateDto };
    return this.tracks[trackIndex];
  }

  remove(id: string): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1)
      throw new NotFoundException(errorMessages.notFound('Track'));
    this.tracks.splice(index, 1);

    this.eventEmitter.emit('track.deleted', id);
  }

  nullifyArtistInTracks(artistId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }

  nullifyAlbumInTracks(albumId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }
}
