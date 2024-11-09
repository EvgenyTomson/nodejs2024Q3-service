import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { errorMessages } from '../helpers/constants';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post(':type/:id')
  @HttpCode(HttpStatus.CREATED)
  addFavorite(@Param('type') type: string, @Param('id') id: string) {
    if (!['track', 'album', 'artist'].includes(type)) {
      throw new BadRequestException(errorMessages.invalidType);
    }
    this.favoritesService.addFavorite(type as 'track' | 'album' | 'artist', id);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFavorite(@Param('type') type: string, @Param('id') id: string) {
    if (!['track', 'album', 'artist'].includes(type)) {
      throw new BadRequestException(errorMessages.invalidType);
    }
    this.favoritesService.removeFavorite(
      type as 'track' | 'album' | 'artist',
      id,
    );
  }
}
