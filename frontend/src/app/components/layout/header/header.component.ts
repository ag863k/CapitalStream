import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <button mat-icon-button (click)="onMenuToggle()" class="menu-button">
        <mat-icon>menu</mat-icon>
      </button>
      
      <span class="app-title">CapitalStream</span>
      
      <span class="spacer"></span>
      
      <div class="user-info" *ngIf="user">
        <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .menu-button {
      margin-right: 16px;
    }
    
    .app-title {
      font-size: 18px;
      font-weight: 500;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .user-name {
      margin-right: 8px;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .user-name {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() user: any = null;
  @Output() menuToggle = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  onMenuToggle() {
    this.menuToggle.emit();
  }

  logout() {
    this.authService.logout();
  }
}
