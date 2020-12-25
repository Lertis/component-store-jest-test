import { OnDestroy } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentStore } from "@ngrx/component-store";
import { of, Subject } from "rxjs";
import { AppComponent } from "./app.component";
import { CustomStore } from "./store.service";

class MockCustomStore extends ComponentStore<{ name: string }> implements OnDestroy {
	readonly destroy$ = new Subject<void>();
	name$ = of("name value");
	readonly updateName = jest.fn();
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

describe("AppComponent", () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let store$: CustomStore;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule
			],
			declarations: [AppComponent],
			providers: [CustomStore]
		})
			.overrideProvider(CustomStore, { useFactory: () => new MockCustomStore(), deps: [] })
			.overrideTemplate(AppComponent, `<span></span>`)
			.compileComponents();
		store$ = TestBed.inject(CustomStore);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should be created", () => {
		expect(component).toBeTruthy();
	});

	it("[Method: updateMethod]", fakeAsync(() => {
		const spy = spyOn(store$, "updateName");
		const newNameValue = "newNameValue";

		component.nameControl.setValue(newNameValue);
		flush();
		fixture.detectChanges();
		component.updateMethod();

		expect(component.nameControl.value).toEqual(newNameValue);
		discardPeriodicTasks();
		expect(spy).toHaveBeenCalledWith(newNameValue);
	}));
});
