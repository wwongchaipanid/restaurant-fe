import { Component, ElementRef, Injector, NgZone, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { IonModal } from '@ionic/angular';
import { RestaurantApi } from './api/restaurant.api';
import { RestaurantCreateCache, RestaurantDetails } from './model/restaurant.model';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  title = 'angular-google-map-search';
  @ViewChild('search')
  public searchElementRef!: ElementRef;

  private restaurantApi: RestaurantApi;

  constructor(
    private ngZone: NgZone,
    private injector: Injector
  ) {
    this.restaurantApi = this.injector.get(RestaurantApi);
  }

  zoom = 12;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDefaultUI: true,
    fullscreenControl: true,
    disableDoubleClickZoom: true,
  };
  latitude!: any;
  longitude!: any;

  restaurantName: any;
  restaurantList: Array<any> = []

  ngOnInit() {
  }


  fnGetDefaultPlace() {
    this.searchElementRef.nativeElement.value = "Bang sue"

    //Create instant of pleaces service
    let placesService = new google.maps.places.PlacesService(
      this.searchElementRef.nativeElement
    );
    let req: google.maps.places.FindPlaceFromQueryRequest = {
      fields: ["all"],
      query: "บางซื่อ"
    }
    placesService.findPlaceFromQuery(req, (resultList, status) => {
      if (resultList && resultList.length > 0) {
        this.latitude = resultList[0].geometry?.location?.lat();
        this.longitude = resultList[0].geometry?.location?.lng();
        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
        this.fnGetRestaurant(resultList[0].name)
      }
    })
  }


  ngAfterViewInit(): void {
    this.fnIsShow()
    this.fnGetDefaultPlace()

    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());
        console.log({ place }, place.geometry.location?.lng());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };

        this.fnGetRestaurant(place.name)
      });
    });
  }

  fnGetRestaurant(placeName?: string) {
    //Get data from backend
    let locationName = placeName
    if (locationName) {
      locationName = locationName.replace(" ", "")
      locationName = locationName.toLocaleLowerCase()
      this.restaurantApi.findCache(locationName).subscribe(
        response => {
          if (response) {
            console.log("restaurantList is found from backend")
            this.restaurantList = response.restaurantList
          }
          else {
            this.fnGetRestaurantNearBy(placeName)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }

  fnGetRestaurantNearBy(locationName?: string) {
    //If no data, then exit
    if (!locationName) return

    locationName = locationName.replace(" ", "")
    locationName = locationName.toLocaleLowerCase()

    //Create instant of pleaces service
    let nearByService = new google.maps.places.PlacesService(
      this.searchElementRef.nativeElement
    );

    //Create request for nearbySearch 
    let reqNearBy: google.maps.places.PlaceSearchRequest = {
      type: "restaurant",
      location: this.center,
      radius: 1000
    }

    //Call method /function nearbySearch
    nearByService.nearbySearch(reqNearBy, (resultList, status, paging) => {
      //Logging
      console.log("status = ", status)
      console.log("resultList = ", resultList)

      //Replace the old one with the new one
      this.restaurantList = resultList ? resultList : []

      //If found data, then call backend API to cache data
      if (resultList) {

        //Create request body
        let req: RestaurantCreateCache = {
          locationName: locationName,
          restaurantList: []
        }
        for (let resultItem of resultList) {
          let item: RestaurantDetails = {
            name: resultItem.name,
            lat: resultItem.geometry?.location?.lat(),
            lng: resultItem.geometry?.location?.lng(),
            rating: resultItem.rating
          }
          req.restaurantList.push(item)
          this.restaurantList = req.restaurantList
        }

        //Send the request to backend api
        console.log("cache name = ", req.locationName)
        this.restaurantApi.createCache(req).subscribe(
          response => {
            console.log(response)
          },
          error => {
            console.log(error)
          }
        )

        this.fnIsShow()
      }
    })
  }


  markerPositions: google.maps.LatLngLiteral[] = [];
  isModalOpen = false;
  setOpen(isOpen: boolean, lat: number, lng: number) {
    this.isModalOpen = isOpen;
    let item = {
      lat: lat,
      lng: lng
    }
    this.markerPositions = []
    this.markerPositions.push(item)
  }

  onWillDismiss(event: Event) {
    this.isModalOpen = false;
  }


  // This is just testing
  isShow = false
  fnIsShow() {
    setTimeout(() => {
      console.log("set isShow")
      this.isShow = !this.isShow
    }, 1000)
  }

}
