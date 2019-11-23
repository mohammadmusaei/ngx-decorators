import { ReplaySubject } from 'rxjs';

export const ObservableGarbageCollector = <T extends new (...args: any[]) => {}>(constructor: T) => {
    constructor.prototype.destroyed$ = new ReplaySubject<boolean>(1);
    if (constructor.prototype.ngOnDestroy) {
        const cloned = constructor.prototype.ngOnDestroy;
        constructor.prototype.ngOnDestroy = () => {
            if (constructor.prototype.destroyed$) {
                constructor.prototype.destroyed$.next(true);
                constructor.prototype.destroyed$.complete();
            }
            cloned.call(constructor);
        };
    } else {
        constructor.prototype.ngOnDestroy = () => {
            if (constructor.prototype.destroyed$) {
                constructor.prototype.destroyed$.next(true);
                constructor.prototype.destroyed$.complete();
            }
        };
    }
    return class extends constructor {
        destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    };
};

export interface IObservableGarbageCollector {
    destroyed$: ReplaySubject<boolean>;
}
