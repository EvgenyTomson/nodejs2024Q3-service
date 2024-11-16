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
  async getAllFavorites() {
    const favorites = await this.favoritesService.getAllFavorites();
    // console.log('favorites: ', favorites);
    return favorites;
    // return await this.favoritesService.getAllFavorites();
  }

  @Post(':type/:id')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(@Param('type') type: string, @Param('id') id: string) {
    await this.favoritesService.addFavorite(type, id);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(@Param('type') type: string, @Param('id') id: string) {
    await this.favoritesService.removeFavorite(type, id);
  }
}
