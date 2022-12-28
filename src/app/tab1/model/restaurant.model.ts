export interface RestaurantCreateCache {
    locationName?: string;
    restaurantList: Array<RestaurantDetails>
}

export interface RestaurantFindCache {
    locationName: string;
    restaurantList: Array<RestaurantDetails>
}

export interface RestaurantDetails {
    name?: string;
    lat?: number;
    lng?: number;
    rating?: number;
}