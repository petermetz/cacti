import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "atomic-swaps-list",
    pathMatch: "full",
  },
  {
    path: "atomic-swaps-list",
    loadChildren: () =>
      import("./atomic-swaps/atomic-swaps.module").then(
        (m) => m.AtomicSwapsPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
