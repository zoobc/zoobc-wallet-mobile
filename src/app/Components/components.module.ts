
import {NgModule} from '@angular/core';
import { PinComponent } from './pin/pin.component'; 
import { IonicModule } from '@ionic/angular';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule.forRoot(),
        TranslateModule
    ],
    declarations: [
        PinComponent,
        SidemenuComponent
    ],
    exports: [
        PinComponent,
        SidemenuComponent
    ]
})
export class ComponentsModule {
}