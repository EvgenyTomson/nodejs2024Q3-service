import { Artist } from '../artist/artist.interface';
import { Album } from '../album/album.interface';
// import { Track } from '../track/track.interface';
import { Track } from '@prisma/client';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
