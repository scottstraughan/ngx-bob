import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BobOrbComponent } from './bob-orb.component';

describe('BobOrbComponent', () => {
  let component: BobOrbComponent;
  let fixture: ComponentFixture<BobOrbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BobOrbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BobOrbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
