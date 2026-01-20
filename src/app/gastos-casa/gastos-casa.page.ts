import { Component, computed, signal } from '@angular/core';
import { GastosService } from '../services/gastos.service';
import { Gasto } from '../models/gasto.model';

@Component({
  selector: 'app-gastos-casa',
  templateUrl: './gastos-casa.page.html',
  styleUrls: ['./gastos-casa.page.scss'],
  standalone: false
})
export class GastosCasaPage {
  // Filter signals
  filterCategory = signal<string>('');
  filterDate = signal<string>('');

  // Add Gasto Form State
  isModalOpen = false;
  newGasto = {
    descripcion: '',
    categoria: '',
    cantidad: null as number | null,
    fecha: new Date().toISOString().split('T')[0]
  };

  // Combined and filtered gastos
  filteredGastos = computed(() => {
    let gastos = this.gastosService.allGastos();
    const cat = this.normalize(this.filterCategory().trim());
    const date = this.filterDate();

    if (cat) {
      gastos = gastos.filter(g => this.normalize(g.categoria).includes(cat));
    }

    if (date) {
      gastos = gastos.filter(g => {
        const itemDate = new Date(g.fecha).toISOString().split('T')[0];
        return itemDate === date;
      });
    }

    return gastos;
  });

  // Total of currently visible gastos
  totalGasto = computed(() => {
    return this.filteredGastos().reduce((acc, g) => acc + g.cantidad, 0);
  });

  // Dynamic Title
  summaryTitle = computed(() => {
    return (this.filterCategory() || this.filterDate())
      ? 'Total gastos de la búsqueda'
      : 'Total gastos';
  });

  constructor(public gastosService: GastosService) { }

  private normalize(text: string): string {
    if (!text) return '';
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  updateCategory(event: any) {
    this.filterCategory.set(event.detail.value || '');
  }

  updateDate(event: any) {
    this.filterDate.set(event.detail.value || '');
  }

  clearFilters() {
    this.filterCategory.set('');
    this.filterDate.set('');
  }

  openAddModal() {
    this.newGasto = {
      descripcion: '',
      categoria: '',
      cantidad: null,
      fecha: new Date().toISOString().split('T')[0]
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveGasto() {
    if (this.newGasto.descripcion && this.newGasto.categoria && this.newGasto.cantidad !== null) {
      this.gastosService.addGasto(
        this.newGasto.descripcion,
        this.newGasto.categoria,
        this.newGasto.cantidad,
        new Date(this.newGasto.fecha)
      );
      this.closeModal();
    }
  }
}
