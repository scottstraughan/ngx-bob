import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BobUiComponent } from './bob-ui.component';

describe('BobUiComponent', () => {
  let component: BobUiComponent;
  let fixture: ComponentFixture<BobUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BobUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BobUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
