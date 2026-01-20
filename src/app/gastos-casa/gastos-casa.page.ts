import { Component, computed, signal } from '@angular/core';
import { GastosService } from '../services/gastos.service';
import { Movimiento } from '../models/movimiento.model';

@Component({
  selector: 'app-gastos-casa',
  templateUrl: './gastos-casa.page.html',
  styleUrls: ['./gastos-casa.page.scss'],
  standalone: false
})
export class GastosCasaPage {
  // Navigation
  selectedTab = signal<'gastos' | 'ingresos'>('gastos');

  // Filter signals
  filterCategory = signal<string>('');
  filterDate = signal<string>('');

  // Add Item Form State
  isModalOpen = false;
  newItem = {
    descripcion: '',
    categoria: '',
    cantidad: null as number | null,
    fecha: new Date().toISOString().split('T')[0]
  };

  // Combined and filtered movements
  filteredItems = computed(() => {
    const tab = this.selectedTab();
    let items = tab === 'gastos' ? this.gastosService.gastos() : this.gastosService.ingresos();

    const cat = this.normalize(this.filterCategory().trim());
    const date = this.filterDate();

    if (cat) {
      items = items.filter(g => this.normalize(g.categoria).includes(cat));
    }

    if (date) {
      items = items.filter(g => {
        const itemDate = new Date(g.fecha).toISOString().split('T')[0];
        return itemDate === date;
      });
    }

    return items;
  });

  // Total of currently visible items
  totalAmount = computed(() => {
    return this.filteredItems().reduce((acc, g) => acc + g.cantidad, 0);
  });

  // Dynamic Title
  summaryTitle = computed(() => {
    const isSearch = this.filterCategory() || this.filterDate();
    const type = this.selectedTab() === 'gastos' ? 'gastos' : 'ingresos';
    return isSearch ? `Total ${type} de la búsqueda` : `Total ${type}`;
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

  setTab(tab: any) {
    this.selectedTab.set(tab.detail.value);
    this.clearFilters();
  }

  openAddModal() {
    this.newItem = {
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

  saveItem() {
    if (this.newItem.descripcion && this.newItem.categoria && this.newItem.cantidad !== null) {
      const tipo: 'gasto' | 'ingreso' = this.selectedTab() === 'gastos' ? 'gasto' : 'ingreso';
      this.gastosService.addMovimiento(
        this.newItem.descripcion,
        this.newItem.categoria,
        this.newItem.cantidad,
        tipo,
        new Date(this.newItem.fecha)
      );
      this.closeModal();
    }
  }

  async deleteItem(id: string) {
    this.gastosService.removeMovimiento(id);
  }
}
