import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

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
    this.favoritesService.addFavorite(type, id);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFavorite(@Param('type') type: string, @Param('id') id: string) {
    this.favoritesService.removeFavorite(type, id);
  }
}
