import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarDatePipe } from "./calendar-date.pipe";

@NgModule({
  declarations: [CalendarDatePipe],
  imports: [CommonModule],
  exports: [CalendarDatePipe]
})
export class CalendarDateModule {}
