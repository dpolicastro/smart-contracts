import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccountsRoutingModule } from './accounts-routing.module';
import { CreateComponent } from './create/create.component';
import { CreateConfirmationComponent } from './create-confirmation/create-confirmation.component';
import { CreateRestoreComponent } from './create-restore/create-restore.component';
import { SigninComponent } from './signin/signin.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    AccountComponent,
    CreateComponent,
    CreateConfirmationComponent,
    CreateRestoreComponent,
    SigninComponent
  ],
  imports: [
    SharedModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
