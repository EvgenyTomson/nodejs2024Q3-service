import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse } from './favorites.interface';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { validate as isUuid } from 'uuid';
import { errorMessages } from '../helpers/constants';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../database/prisma.service';
// import { Favorites } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @OnEvent('track.deleted')
  handleTrackDeletedEvent(id: string) {
    this.removeTrackFromFavorites(id);
  }

  @OnEvent('artist.deleted')
  handleArtistDeletedEvent(id: string) {
    this.removeArtistFromFavorites(id);
  }

  @OnEvent('album.deleted')
  handleAlbumDeletedEvent(id: string) {
    this.removeAlbumFromFavorites(id);
  }

  async onModuleInit() {
    await this.initializeFavorites();

    // this.eventEmitter.on(
    //   'track.deleted',
    //   this.handleTrackDeletedEvent.bind(this),
    // );
    // this.eventEmitter.on(
    //   'artist.deleted',
    //   this.handleArtistDeletedEvent.bind(this),
    // );
    // this.eventEmitter.on(
    //   'album.deleted',
    //   this.handleAlbumDeletedEvent.bind(this),
    // );
  }

  async initializeFavorites() {
    const exists = await this.prisma.favorites.findUnique({ where: { id: 1 } });
    if (!exists) {
      await this.prisma.favorites.create({
        data: {
          id: 1,
          artists: [],
          albums: [],
          tracks: [],
        },
      });
    }
  }

  async getAllFavorites(): Promise<FavoritesResponse> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });
    if (!favorites)
      throw new NotFoundException(errorMessages.notFound('Favorites'));

    return {
      artists: await Promise.all(
        favorites.artists.map((id) => this.artistService.findOne(id)),
      ),
      albums: await Promise.all(
        favorites.albums.map((id) => this.albumService.findOne(id)),
      ),
      tracks: await Promise.all(
        favorites.tracks.map((id) => this.trackService.findOne(id)),
      ),
    };
  }

  async addFavorite(type: string, id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);

    let entityExists = false;
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });

    switch (type) {
      case 'track':
        entityExists = !!(await this.trackService.findOne(id));
        if (entityExists && !favorites.tracks.includes(id)) {
          await this.prisma.favorites.update({
            where: { id: 1 },
            data: { tracks: { push: id } },
          });
        }
        break;
      case 'album':
        entityExists = !!(await this.albumService.findOne(id));
        if (entityExists && !favorites.albums.includes(id)) {
          await this.prisma.favorites.update({
            where: { id: 1 },
            data: { albums: { push: id } },
          });
        }
        break;
      case 'artist':
        entityExists = !!(await this.artistService.findOne(id));
        if (entityExists && !favorites.artists.includes(id)) {
          await this.prisma.favorites.update({
            where: { id: 1 },
            data: { artists: { push: id } },
          });
        }
        break;
      default:
        throw new BadRequestException(errorMessages.invalidType);
    }
    if (!entityExists) {
      throw new UnprocessableEntityException(
        errorMessages.notFound(`Favorite ${type}`),
      );
    }
  }

  async removeFavorite(type: string, id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);

    if (!['track', 'album', 'artist'].includes(type)) {
      throw new BadRequestException(errorMessages.invalidType);
    }

    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });
    if (!favorites)
      throw new NotFoundException(errorMessages.notFound('Favorites'));

    const list = favorites[type + 's'] as string[];
    if (!list.includes(id)) {
      throw new NotFoundException(errorMessages.notFound('Favorite'));
    }

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: {
        [type + 's']: list.filter((favoriteId) => favoriteId !== id),
      },
    });
  }

  private async removeTrackFromFavorites(id: string) {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });
    if (!favorites) return;

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: {
        tracks: favorites.tracks.filter((trackId) => trackId !== id),
      },
    });
  }

  private async removeAlbumFromFavorites(id: string) {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });
    if (!favorites) return;

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: {
        albums: favorites.albums.filter((albumId) => albumId !== id),
      },
    });
  }

  private async removeArtistFromFavorites(id: string) {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
    });
    if (!favorites) return;

    await this.prisma.favorites.update({
      where: { id: 1 },
      data: {
        artists: favorites.artists.filter((artistId) => artistId !== id),
      },
    });
  }
}
