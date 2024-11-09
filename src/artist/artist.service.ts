import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Artist } from './artist.interface';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { v4 as uuidv4 } from 'uuid';
import { errorMessages } from '../helpers/constants';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    private eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
  ) {}

  findAll() {
    return this.artists;
  }

  findOne(id: string): Artist | undefined {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) return;

    return artist;
  }

  create(createArtistDto: CreateArtistDto) {
    const newArtist: Artist = {
      id: uuidv4(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };
    this.artists.push(newArtist);

    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artistIndex = this.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1)
      throw new NotFoundException(errorMessages.notFound('Artist'));

    this.artists[artistIndex] = {
      ...this.artists[artistIndex],
      ...updateArtistDto,
    };

    return this.artists[artistIndex];
  }

  remove(id: string): void {
    const artistIndex = this.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1)
      throw new NotFoundException(errorMessages.notFound('Artist'));

    this.artists.splice(artistIndex, 1);

    this.trackService.nullifyArtistInTracks(id);
    this.albumService.nullifyArtistInAlbums(id);
    this.eventEmitter.emit('artist.deleted', id);
  }
}
