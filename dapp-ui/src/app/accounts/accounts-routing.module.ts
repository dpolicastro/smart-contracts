import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { CreateComponent } from './create/create.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  {
    path: '', component: AccountComponent, children: [
      { path: 'create', component: CreateComponent },
      { path: 'signin', component: SigninComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
