import {Injectable} from '@angular/core'

@Injectable()
export class localStorage {

    set(key: string, val: any) {
        localStorage.setItem(key, val)
    }


    get(key: string) {
        return localStorage.getItem(key)
    }

    remove(key) {
        localStorage.removeItem(key)
    }

}
