import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialMenuesPage } from './historial-menues.page';

describe('HistorialMenuesPage', () => {
  let component: HistorialMenuesPage;
  let fixture: ComponentFixture<HistorialMenuesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialMenuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
