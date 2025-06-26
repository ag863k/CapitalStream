import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <mat-card class="welcome-card">
        <mat-card-content>
          <h1>Welcome to CapitalStream</h1>
          <p *ngIf="currentUser$ | async as user">Hello, {{ user.firstName }}!</p>
          <p>Your comprehensive banking dashboard</p>
        </mat-card-content>
      </mat-card>

      <div class="dashboard-grid">
        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="action-buttons">
              <button mat-raised-button color="primary" routerLink="/accounts">
                <mat-icon>account_balance</mat-icon>
                View Accounts
              </button>
              <button mat-raised-button color="accent" routerLink="/transactions">
                <mat-icon>receipt</mat-icon>
                View Transactions
              </button>
              <button mat-raised-button routerLink="/transactions/new">
                <mat-icon>add</mat-icon>
                New Transaction
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-header>
            <mat-card-title>Account Summary</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="summary-item">
              <span>Total Balance:</span>
              <span class="amount">$0.00</span>
            </div>
            <div class="summary-item">
              <span>Active Accounts:</span>
              <span>0</span>
            </div>
            <div class="summary-item">
              <span>Recent Transactions:</span>
              <span>0</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-card {
      margin-bottom: 24px;
      text-align: center;
    }

    .welcome-card h1 {
      color: #1976d2;
      margin-bottom: 16px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: flex-start;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .amount {
      font-weight: 600;
      color: #1976d2;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    // Initialize dashboard data
  }
}
