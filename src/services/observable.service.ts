import {Injectable} from '@angular/core'
import {Subject} from 'rxjs'
import {debounceTime} from "rxjs/operators";

@Injectable()
export class ObservableService {

    observ: any = {}
    data: any = {}

    Watch(name) {
        if (!this.observ[name]) {
            this.observ[name] = new Subject()
        }
        return this.observ[name].asObservable()
    }

    WatchOnce(name, debounce = 0) {
        return new Promise(done => {
            const watcher_once = this.Watch(name).pipe(debounceTime(debounce)).subscribe(data => {
                setTimeout(() => watcher_once.unsubscribe())
                return done(data)
            })
        })
    }

    Push(name, val) {
        if (!this.observ[name]) {
            this.observ[name] = new Subject()
        }
        this.data[name] = val
        this.observ[name].next(val)
    }

    Set(name, val) {
        this.data[name] = val
    }

    Get(name) {
        return this.data[name]
    }

	GetAll() {
		return this.data
	}

    GetAndSet(name, val = null) {
        const value = this.data[name]
        this.data[name] = val
        return value
    }

    SetMultiple(objects) {
        for (const obj in objects) {
            this.data[obj] = objects[obj]
        }
    }

    GetMultiple(array) {
        const object: any = {}
        array.forEach(arr => {
            object[arr] = this.data[arr]
        })
        return object
    }

    GetMultipleAndSet(array, val = null) {
        const object: any = {}
        array.forEach(arr => {
            object[arr] = this.data[arr]
            this.data[arr] = val
        })
        return object
    }

}
