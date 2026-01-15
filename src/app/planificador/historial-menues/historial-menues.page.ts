import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-historial-menues',
  templateUrl: './historial-menues.page.html',
  styleUrls: ['./historial-menues.page.scss'],
  standalone: false
})
export class HistorialMenuesPage implements OnInit {
  menuHistory: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const saved = localStorage.getItem('menu_history');
    if (saved) {
      this.menuHistory = JSON.parse(saved);
    }
  }

  async deleteMenu(id: number, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Menú',
      message: '¿Estás seguro de que quieres eliminar este menú del historial?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.menuHistory = this.menuHistory.filter(m => m.id !== id);
            localStorage.setItem('menu_history', JSON.stringify(this.menuHistory));
          }
        }
      ]
    });
    await alert.present();
  }

  async restoreMenu(menu: any) {
    const alert = await this.alertCtrl.create({
      header: 'Cargar Menú',
      message: `¿Quieres cargar el menú "${menu.name}" en el planificador actual? Se sobrescribirá lo que tengas ahora.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cargar',
          handler: () => {
            localStorage.setItem('weekly_menu', JSON.stringify(menu.schedule));
            this.toastCtrl.create({
              message: 'Menú cargado correctamente',
              duration: 2000,
              color: 'success'
            }).then(t => t.present());
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }
}
