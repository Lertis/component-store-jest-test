import { Injectable, OnDestroy } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Injectable()
export class CustomStore extends ComponentStore<{ name: string }>
	implements OnDestroy {
	readonly destroy$ = new Subject<void>();

	name$: Observable<string> = this.select(state => state.name).pipe(
		takeUntil(this.destroy$)
	);

	constructor() {
		super({ name: "" });
	}

	readonly updateName = this.updater((state, name: string) => ({
		...state,
		name
	}));

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
