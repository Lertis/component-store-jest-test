import { Component, Inject, OnDestroy, Self } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";
import { CustomStore } from "./store.service";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	providers: [CustomStore]
})
export class AppComponent implements OnDestroy {
	private readonly destroy$ = new Subject<void>();
	name$: Observable<string>;
	disabledButton = true;

	nameControl = new FormControl("");

	constructor(@Self() @Inject(CustomStore) readonly store$: CustomStore) {
		this.name$ = this.store$.name$.pipe(takeUntil(this.destroy$));

		this.nameControl.valueChanges.pipe(
			takeUntil(this.destroy$),
			debounceTime(50),
		).subscribe(() => this.formChanged());
	}

	updateMethod() {
		this.store$.updateName(this.nameControl.value);
	}

	private formChanged() {
		this.disabledButton = formValidation(this.nameControl.value);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

function formValidation(name: string): boolean {
	return !(!!name && name.trim().length !== 0);
}
