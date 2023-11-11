import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AtomicSwapsListPage } from "./atomic-swaps-list/atomic-swaps-list.page";

const routes: Routes = [
  {
    path: "",
    component: AtomicSwapsListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtomicSwapsPageRoutingModule {}
