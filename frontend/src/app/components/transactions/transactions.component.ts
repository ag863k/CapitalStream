import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  standalone: false,
  template: `
    <div class="transactions-container">
      <div class="page-header">
        <h1>Transaction History</h1>
        <button mat-raised-button color="primary" routerLink="/transactions/new">
          <mat-icon>add</mat-icon>
          New Transaction
        </button>
      </div>

      <mat-card class="filters-card">
        <mat-card-content>
          <div class="filters-row">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput placeholder="Search transactions..." [(ngModel)]="searchTerm">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Type</mat-label>
              <mat-select [(ngModel)]="selectedType">
                <mat-option value="">All Types</mat-option>
                <mat-option value="credit">Credit</mat-option>
                <mat-option value="debit">Debit</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date Range</mat-label>
              <mat-date-range-input [rangePicker]="picker">
                <input matStartDate placeholder="Start date">
                <input matEndDate placeholder="End date">
              </mat-date-range-input>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-date-range-picker #picker></mat-date-range-picker>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="transactions-table-card">
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="transactions" class="transactions-table">
              
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef>Date</th>
                <td mat-cell *matCellDef="let transaction">
                  {{ transaction.date | date:'short' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>Description</th>
                <td mat-cell *matCellDef="let transaction">
                  <div class="transaction-description">
                    <div class="description-text">{{ transaction.description }}</div>
                    <div class="merchant-text" *ngIf="transaction.merchant">{{ transaction.merchant }}</div>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="category">
                <th mat-header-cell *matHeaderCellDef>Category</th>
                <td mat-cell *matCellDef="let transaction">
                  <mat-chip class="category-chip">{{ transaction.category }}</mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let transaction">
                  <mat-chip [ngClass]="getTypeClass(transaction.type)">
                    {{ transaction.type | titlecase }}
                  </mat-chip>
                </td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let transaction">
                  <span [ngClass]="getAmountClass(transaction.type)">
                    {{ transaction.amount | currency }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let transaction">
                  <button mat-icon-button (click)="viewTransaction(transaction.id)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .transactions-container {
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

    .filters-card {
      margin-bottom: 24px;
    }

    .filters-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      align-items: center;
    }

    .table-container {
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      min-width: 600px;
    }

    .transaction-description {
      display: flex;
      flex-direction: column;
    }

    .description-text {
      font-weight: 500;
    }

    .merchant-text {
      font-size: 12px;
      color: #666;
    }

    .category-chip {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .type-credit {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .type-debit {
      background-color: #ffebee;
      color: #c62828;
    }

    .amount-credit {
      color: #4caf50;
      font-weight: 600;
    }

    .amount-debit {
      color: #f44336;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .filters-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TransactionsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'description', 'category', 'type', 'amount', 'actions'];
  transactions: any[] = [];
  searchTerm = '';
  selectedType = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    // Mock data for now
    this.transactions = [
      {
        id: '1',
        date: new Date('2024-06-25'),
        description: 'Grocery Shopping',
        merchant: 'Fresh Market',
        category: 'Food & Dining',
        type: 'debit',
        amount: 125.50
      },
      {
        id: '2',
        date: new Date('2024-06-24'),
        description: 'Salary Deposit',
        merchant: 'ABC Company',
        category: 'Income',
        type: 'credit',
        amount: 2000.00
      },
      {
        id: '3',
        date: new Date('2024-06-23'),
        description: 'Gas Station',
        merchant: 'Shell Gas',
        category: 'Transportation',
        type: 'debit',
        amount: 75.00
      }
    ];
  }

  viewTransaction(transactionId: string) {
    this.router.navigate(['/transactions', transactionId]);
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }

  getAmountClass(type: string): string {
    return `amount-${type}`;
  }
}
