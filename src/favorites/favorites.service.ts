import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './favorites.interface';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { validate as isUuid } from 'uuid';
import { errorMessages } from '../helpers/constants';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  getAllFavorites(): FavoritesResponse {
    return {
      artists: this.favorites.artists
        .map((id) => this.artistService.findOne(id))
        .filter(Boolean),
      albums: this.favorites.albums
        .map((id) => this.albumService.findOne(id))
        .filter(Boolean),
      tracks: this.favorites.tracks
        .map((id) => this.trackService.findOne(id))
        .filter(Boolean),
    };
  }

  addFavorite(type: 'track' | 'album' | 'artist', id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);

    let entityExists = false;
    switch (type) {
      case 'track':
        entityExists = !!this.trackService.findOne(id);
        if (entityExists && !this.favorites.tracks.includes(id))
          this.favorites.tracks.push(id);
        break;
      case 'album':
        entityExists = !!this.albumService.findOne(id);
        if (entityExists && !this.favorites.albums.includes(id))
          this.favorites.albums.push(id);
        break;
      case 'artist':
        entityExists = !!this.artistService.findOne(id);
        if (entityExists && !this.favorites.artists.includes(id))
          this.favorites.artists.push(id);
        break;
      default:
        throw new BadRequestException(errorMessages.invalidType);
    }
    if (!entityExists)
      throw new UnprocessableEntityException(
        errorMessages.notFound(`Favorive ${type}`),
      );
  }

  removeFavorite(type: 'track' | 'album' | 'artist', id: string) {
    if (!isUuid(id)) throw new BadRequestException(errorMessages.invalidId);

    const list = this.favorites[type + 's'] as string[];
    const index = list.indexOf(id);
    if (index === -1)
      throw new NotFoundException(errorMessages.notFound('Favorite'));

    list.splice(index, 1);
  }

  removeTrackFromFavorites(id: string) {
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }

  removeAlbumFromFavorites(id: string) {
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
  }

  removeArtistFromFavorites(id: string) {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
  }
}
