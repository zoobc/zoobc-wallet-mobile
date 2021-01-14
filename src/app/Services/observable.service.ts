// ZooBC Copyright (C) 2020 Quasisoft Limited - Hong Kong
// This file is part of ZooBC <https:github.com/zoobc/zoobc-wallet-mobile>

// ZooBC is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// ZooBC is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with ZooBC.  If not, see <http:www.gnu.org/licenses/>.

// Additional Permission Under GNU GPL Version 3 section 7.
// As the special exception permitted under Section 7b, c and e,
// in respect with the Author’s copyright, please refer to this section:

// 1. You are free to convey this Program according to GNU GPL Version 3,
//     as long as you respect and comply with the Author’s copyright by
//     showing in its user interface an Appropriate Notice that the derivate
//     program and its source code are “powered by ZooBC”.
//     This is an acknowledgement for the copyright holder, ZooBC,
//     as the implementation of appreciation of the exclusive right of the
//     creator and to avoid any circumvention on the rights under trademark
//     law for use of some trade names, trademarks, or service marks.

// 2. Complying to the GNU GPL Version 3, you may distribute
//     the program without any permission from the Author.
//     However a prior notification to the authors will be appreciated.

// ZooBC is architected by Roberto Capodieci & Barton Johnston
//             contact us at roberto.capodieci[at]blockchainzoo.com
//             and barton.johnston[at]blockchainzoo.com

// IMPORTANT: The above copyright notice and this permission notice
// shall be included in all copies or substantial portions of the Software.

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable()
export class ObservableService {

    observ: any = {};
    data: any = {};

    Watch(name) {
        if (!this.observ[name]) {
            this.observ[name] = new Subject();
        }
        return this.observ[name].asObservable();
    }

    WatchOnce(name, debounce = 0) {
        return new Promise(done => {
            const watcherOnce = this.Watch(name).pipe(debounceTime(debounce)).subscribe(data => {
                setTimeout(() => watcherOnce.unsubscribe());
                return done(data);
            });
        });
    }

    Push(name, val) {
        if (!this.observ[name]) {
            this.observ[name] = new Subject();
        }
        this.data[name] = val;
        this.observ[name].next(val);
    }

    Set(name, val) {
        this.data[name] = val;
    }

    Get(name) {
        return this.data[name];
    }

    GetAll() {
        return this.data;
    }

    GetAndSet(name, val = null) {
        const value = this.data[name];
        this.data[name] = val;
        return value;
    }

    SetMultiple(objects) {
        // tslint:disable-next-line:forin
        for (const obj in objects) {
            this.data[obj] = objects[obj];
        }
    }

    GetMultiple(array) {
        const object: any = {};
        array.forEach(arr => {
            object[arr] = this.data[arr];
        });
        return object;
    }

    GetMultipleAndSet(array, val = null) {
        const object: any = {};
        array.forEach(arr => {
            object[arr] = this.data[arr];
            this.data[arr] = val;
        });
        return object;
    }

}
