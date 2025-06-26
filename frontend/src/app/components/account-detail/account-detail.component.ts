import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-detail',
  standalone: false,
  template: `
    <div class="account-detail-container">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Account Details</h1>
      </div>

      <mat-card class="account-info-card" *ngIf="account">
        <mat-card-header>
          <mat-card-title>{{ account.name }}</mat-card-title>
          <mat-card-subtitle>{{ account.accountNumber }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="account-details">
            <div class="detail-item">
              <span class="label">Balance:</span>
              <span class="value balance" [ngClass]="getBalanceClass(account.balance)">
                {{ account.balance | currency }}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Type:</span>
              <span class="value">{{ account.type | titlecase }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Status:</span>
              <mat-chip [color]="account.isActive ? 'accent' : 'warn'">
                {{ account.isActive ? 'Active' : 'Inactive' }}
              </mat-chip>
            </div>
            <div class="detail-item">
              <span class="label">Created:</span>
              <span class="value">{{ account.createdAt | date:'medium' }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="recent-transactions-card">
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
          <button mat-button color="primary" routerLink="/transactions">View All</button>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="recentTransactions.length > 0; else noTransactions">
            <div class="transaction-item" *ngFor="let transaction of recentTransactions">
              <div class="transaction-info">
                <div class="transaction-description">{{ transaction.description }}</div>
                <div class="transaction-date">{{ transaction.date | date:'short' }}</div>
              </div>
              <div class="transaction-amount" [ngClass]="getAmountClass(transaction.type)">
                {{ transaction.amount | currency }}
              </div>
            </div>
          </div>
          <ng-template #noTransactions>
            <p class="no-transactions">No recent transactions</p>
          </ng-template>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .account-detail-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      color: #1976d2;
    }

    .account-info-card {
      margin-bottom: 24px;
    }

    .account-details {
      display: grid;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .label {
      font-weight: 500;
      color: #666;
    }

    .value {
      font-weight: 500;
    }

    .balance {
      font-size: 18px;
      font-weight: 600;
    }

    .balance-positive {
      color: #4caf50;
    }

    .balance-negative {
      color: #f44336;
    }

    .transaction-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .transaction-info {
      flex: 1;
    }

    .transaction-description {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .transaction-date {
      font-size: 12px;
      color: #666;
    }

    .transaction-amount {
      font-weight: 600;
    }

    .amount-credit {
      color: #4caf50;
    }

    .amount-debit {
      color: #f44336;
    }

    .no-transactions {
      text-align: center;
      color: #666;
      font-style: italic;
    }
  `]
})
export class AccountDetailComponent implements OnInit {
  account: any = null;
  recentTransactions: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId) {
      this.loadAccount(accountId);
      this.loadRecentTransactions(accountId);
    }
  }

  loadAccount(accountId: string) {
    // Mock data for now
    this.account = {
      id: accountId,
      name: 'Primary Checking',
      accountNumber: '****1234',
      type: 'checking',
      balance: 5250.75,
      isActive: true,
      createdAt: new Date('2023-01-15')
    };
  }

  loadRecentTransactions(accountId: string) {
    // Mock data for now
    this.recentTransactions = [
      {
        id: '1',
        description: 'Grocery Shopping',
        type: 'debit',
        amount: 125.50,
        date: new Date('2024-06-25')
      },
      {
        id: '2',
        description: 'Salary Deposit',
        type: 'credit',
        amount: 2000.00,
        date: new Date('2024-06-24')
      }
    ];
  }

  goBack() {
    this.router.navigate(['/accounts']);
  }

  getBalanceClass(balance: number): string {
    return balance >= 0 ? 'balance-positive' : 'balance-negative';
  }

  getAmountClass(type: string): string {
    return `amount-${type}`;
  }
}
