import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Multiplication } from './multiplication';

describe('Multiplication', () => {
  let component: Multiplication;
  let fixture: ComponentFixture<Multiplication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Multiplication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Multiplication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
