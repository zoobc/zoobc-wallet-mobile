
import {NgModule} from '@angular/core';
import { PinComponent } from './pin/pin.component';
import { IonicModule } from '@ionic/angular';
import { SidemenuComponent } from './sidemenu/sidemenu.component';

@NgModule({
    imports: [
        IonicModule.forRoot(),
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