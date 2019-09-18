import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

@Pipe({
  name: "calendarDate"
})
export class CalendarDatePipe implements PipeTransform {
  transform(value: Date, args?: any): any {
    const date = moment(value).calendar();
    return date;
  }
}
