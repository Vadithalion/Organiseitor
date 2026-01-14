import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organiseitor',
  templateUrl: 'organiseitor.page.html',
  styleUrls: ['organiseitor.page.scss'],
  standalone: false,
})
export class OrganiseitorPage {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['/principal']);
  }

}
