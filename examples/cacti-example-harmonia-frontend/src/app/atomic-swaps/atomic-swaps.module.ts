import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AtomicSwapsPageRoutingModule } from "./atomic-swaps-routing.module";

import { AtomicSwapsListPage } from "./atomic-swaps-list/atomic-swaps-list.page";
import { PageHeadingComponentModule } from "../common/page-heading/page-heading-component.module";
import { AtomicSwapsDetailPage } from "./atomic-swaps-detail/atomic-swaps-detail.page";
import { ApiService } from "../api-service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AtomicSwapsPageRoutingModule,
    PageHeadingComponentModule,
  ],
  providers: [ApiService],
  declarations: [AtomicSwapsDetailPage, AtomicSwapsListPage],
})
export class AtomicSwapsPageModule {}
