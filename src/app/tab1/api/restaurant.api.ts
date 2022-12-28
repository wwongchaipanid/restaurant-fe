import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { RestaurantCreateCache, RestaurantFindCache } from '../model/restaurant.model';

@Injectable()
export class RestaurantApi {
  baseUrl = environment.backendUrl + '/restaurants';

  constructor(private httpClient: HttpClient) { }

  createCache(restaurantCreateCache: RestaurantCreateCache) {
    return this.httpClient.post(this.baseUrl, restaurantCreateCache);
  }

  findCache(locationName: string) {
    return this.httpClient.get<RestaurantFindCache>(this.baseUrl + "/" + locationName);
  }
}
