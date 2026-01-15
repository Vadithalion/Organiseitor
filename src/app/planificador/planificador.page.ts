import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  // schedule[dayIndex][0] = lunch list, schedule[dayIndex][1] = dinner list
  schedule: PostIt[][][] = [];

  constructor() {
    this.initSchedule();
  }

  ngOnInit() {
    this.loadSchedule();
  }

  initSchedule() {
    this.schedule = this.days.map((_, dIdx) => [
      [{ id: `l-${dIdx}`, text: '' }],  // Lunch slot
      [{ id: `d-${dIdx}`, text: '' }]   // Dinner slot
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

  saveSchedule() {
    localStorage.setItem('weekly_menu', JSON.stringify(this.schedule));
  }

  loadSchedule() {
    const saved = localStorage.getItem('weekly_menu');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === this.days.length) {
          this.schedule = parsed;
        }
      } catch (e) {
        console.error('Error loading schedule', e);
        this.initSchedule();
      }
    }
  }
}
