import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsModule } from './accounts/accounts.module';

const routes: Routes = [
  {
    path: 'accounts', loadChildren: () => AccountsModule
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
