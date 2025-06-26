import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  template: `
    <div class="sidenav-content">
      <div class="sidenav-header">
        <h3>Navigation</h3>
        <button mat-icon-button (click)="onCloseSidenav()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-nav-list>
        <a mat-list-item routerLink="/dashboard" (click)="onCloseSidenav()">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        
        <a mat-list-item routerLink="/accounts" (click)="onCloseSidenav()">
          <mat-icon matListItemIcon>account_balance</mat-icon>
          <span matListItemTitle>Accounts</span>
        </a>
        
        <a mat-list-item routerLink="/transactions" (click)="onCloseSidenav()">
          <mat-icon matListItemIcon>receipt</mat-icon>
          <span matListItemTitle>Transactions</span>
        </a>
        
        <mat-divider></mat-divider>
        
        <a mat-list-item routerLink="/settings" (click)="onCloseSidenav()">
          <mat-icon matListItemIcon>settings</mat-icon>
          <span matListItemTitle>Settings</span>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidenav-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .sidenav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .sidenav-header h3 {
      margin: 0;
      font-weight: 500;
    }
    
    .close-button {
      margin-left: auto;
    }
    
    .mat-nav-list {
      flex: 1;
      padding-top: 8px;
    }
    
    .mat-list-item {
      height: 48px !important;
    }
    
    .mat-list-item:hover {
      background-color: #f5f5f5;
    }
    
    .mat-list-item.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }
  `]
})
export class SidenavComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  onCloseSidenav() {
    this.closeSidenav.emit();
  }
}
