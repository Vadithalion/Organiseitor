import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

interface PostIt {
  id: string;
  text: string;
}

@Component({
  selector: 'app-planificador',
  templateUrl: './planificador.page.html',
  styleUrls: ['./planificador.page.scss'],
  standalone: false
})
export class PlanificadorPage implements OnInit {
  days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  fullDayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  // schedule[dayIndex][0] = lunch list, schedule[dayIndex][1] = dinner list
  schedule: PostIt[][][] = [];

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.initSchedule();
  }

  ngOnInit() {
    this.loadSchedule();
  }

  initSchedule() {
    this.schedule = this.fullDayNames.map((_, dIdx) => [
      [{ id: `l-${dIdx}-${Date.now()}`, text: '' }],  // Lunch slot
      [{ id: `d-${dIdx}-${Date.now()}`, text: '' }]   // Dinner slot
    ]);
  }

  drop(event: CdkDragDrop<PostIt[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Swapping logic
      const sourceList = event.previousContainer.data;
      const targetList = event.container.data;

      const sourceItem = sourceList[event.previousIndex];
      const targetItem = targetList[0];

      if (targetItem) {
        // Swap them
        sourceList[event.previousIndex] = targetItem;
        targetList[0] = sourceItem;
      } else {
        // Move if target is empty (should not happen in this fixed 5x2 grid but good to have)
        transferArrayItem(
          sourceList,
          targetList,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
    this.saveSchedule();
  }

  async saveToHistory() {
    const hasContent = this.schedule.some(day =>
      day[0].some(p => p.text.trim()) || day[1].some(p => p.text.trim())
    );

    if (!hasContent) {
      const toast = await this.toastCtrl.create({
        message: 'El menú está vacío',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Guardar Menú',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del menú (ej: Semana 1)'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.performSave(data.name || `Menú ${new Date().toLocaleDateString()}`);
          }
        }
      ]
    });
    await alert.present();
  }

  performSave(name: string) {
    const historySaved = localStorage.getItem('menu_history');
    let history = historySaved ? JSON.parse(historySaved) : [];

    const newEntry = {
      id: Date.now(),
      name: name,
      date: new Date().toISOString(),
      schedule: JSON.parse(JSON.stringify(this.schedule))
    };

    history.unshift(newEntry);
    localStorage.setItem('menu_history', JSON.stringify(history));

    this.toastCtrl.create({
      message: 'Menú guardado en el historial ✅',
      duration: 2000,
      color: 'success'
    }).then(t => t.present());
  }

  goToHistory() {
    this.router.navigate(['/planificador/historial-menues']);
  }

  saveSchedule() {
    localStorage.setItem('weekly_menu', JSON.stringify(this.schedule));
  }

  loadSchedule() {
    const saved = localStorage.getItem('weekly_menu');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          this.schedule = parsed;
        }
      } catch (e) {
        console.error('Error loading schedule', e);
        this.initSchedule();
      }
    }
  }

  async showInfo() {
    const alert = await this.alertCtrl.create({
      header: 'Menú Semanal',
      message: 'Organiza tus comidas de la semana. Puedes escribir en cada celda y arrastrar los post-its para intercambiar platos entre días. ¡No olvides guardar tu menú en el historial!',
      buttons: ['Entendido'],
      cssClass: 'custom-info-alert'
    });
    await alert.present();
  }
}
