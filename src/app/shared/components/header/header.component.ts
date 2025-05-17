import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {CdkMenuModule} from '@angular/cdk/menu';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true, 
  imports:[
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CdkMenuModule
  ],
})
export class HeaderComponent {
  isEnableItemHome: boolean = true;

  constructor(private router: Router) { 
  
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        console.log('event click end =>', event.url)
       this.isEnableItemHome = (event.url === '/' || event.url === '/home' ) ? false : true;
      }
    });
  }


  getIcon() {
    return this.isEnableItemHome ? 'arrow_back' : 'help_outline';
  }

  goTo(route: string) {
   this.router.navigate([route]);
  }

  back() {
    if(this.isEnableItemHome) {
      history.back()
    }
  
  }
}
