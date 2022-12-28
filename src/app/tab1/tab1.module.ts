import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { GoogleMapsModule } from '@angular/google-maps'
import { RestaurantApi } from './api/restaurant.api';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [
    Tab1Page
  ],
  providers: [
    RestaurantApi]

})
export class Tab1PageModule {}
