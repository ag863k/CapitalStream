import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  standalone: false,
  template: `
    <div class="accounts-container">
      <div class="page-header">
        <h1>My Accounts</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Add Account
        </button>
      </div>

      <div class="accounts-grid" *ngIf="accounts.length > 0; else noAccounts">
        <mat-card *ngFor="let account of accounts" class="account-card" 
                  (click)="viewAccount(account.id)">
          <mat-card-header>
            <mat-card-title>{{ account.name }}</mat-card-title>
            <mat-card-subtitle>{{ account.number }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="account-balance">
              <span class="balance-label">Balance:</span>
              <span class="balance-amount" [ngClass]="getBalanceClass(account.balance)">
                {{ account.balance | currency }}
              </span>
            </div>
            <div class="account-type">
              <mat-chip>{{ account.type | titlecase }}</mat-chip>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #noAccounts>
        <mat-card class="no-accounts-card">
          <mat-card-content>
            <div class="no-accounts-content">
              <mat-icon class="no-accounts-icon">account_balance</mat-icon>
              <h2>No Accounts Found</h2>
              <p>You don't have any accounts yet. Create your first account to get started.</p>
              <button mat-raised-button color="primary">
                <mat-icon>add</mat-icon>
                Create Account
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </ng-template>
    </div>
  `,
  styles: [`
    .accounts-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      color: #1976d2;
    }

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .account-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .account-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.12);
    }

    .account-balance {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .balance-label {
      font-weight: 500;
      color: #666;
    }

    .balance-amount {
      font-size: 18px;
      font-weight: 600;
    }

    .balance-positive {
      color: #4caf50;
    }

    .balance-negative {
      color: #f44336;
    }

    .account-type {
      margin-top: 8px;
    }

    .no-accounts-card {
      text-align: center;
      padding: 40px;
    }

    .no-accounts-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .no-accounts-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .accounts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    // TODO: Load accounts from service
    this.loadAccounts();
  }

  loadAccounts() {
    // Mock data for now
    this.accounts = [
      {
        id: '1',
        name: 'Primary Checking',
        number: '****1234',
        type: 'checking',
        balance: 5250.75
      },
      {
        id: '2',
        name: 'Emergency Savings',
        number: '****5678',
        type: 'savings',
        balance: 15000.00
      },
      {
        id: '3',
        name: 'Rewards Credit Card',
        number: '****9012',
        type: 'credit',
        balance: -850.25
      }
    ];
  }

  viewAccount(accountId: string) {
    this.router.navigate(['/accounts', accountId]);
  }

  getBalanceClass(balance: number): string {
    return balance >= 0 ? 'balance-positive' : 'balance-negative';
  }
}
