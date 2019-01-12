import { async, TestBed } from '@angular/core/testing';
import { DatepickerModule } from './datepicker.module';

describe('DatepickerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DatepickerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DatepickerModule).toBeDefined();
  });
});
