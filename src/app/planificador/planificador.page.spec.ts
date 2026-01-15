import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanificadorPage } from './planificador.page';

describe('PlanificadorPage', () => {
  let component: PlanificadorPage;
  let fixture: ComponentFixture<PlanificadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanificadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
