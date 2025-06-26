import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-detail',
  standalone: false,
  template: `
    <div class="transaction-detail-container">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Transaction Details</h1>
      </div>

      <mat-card *ngIf="transaction">
        <mat-card-content>
          <div class="transaction-details">
            <div class="detail-row">
              <span class="label">Amount:</span>
              <span class="value amount" [ngClass]="getAmountClass(transaction.type)">
                {{ transaction.amount | currency }}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="label">Type:</span>
              <mat-chip [ngClass]="getTypeClass(transaction.type)">
                {{ transaction.type | titlecase }}
              </mat-chip>
            </div>
            
            <div class="detail-row">
              <span class="label">Description:</span>
              <span class="value">{{ transaction.description }}</span>
            </div>
            
            <div class="detail-row" *ngIf="transaction.merchant">
              <span class="label">Merchant:</span>
              <span class="value">{{ transaction.merchant }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Category:</span>
              <span class="value">{{ transaction.category }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">{{ transaction.date | date:'full' }}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">Status:</span>
              <mat-chip [color]="getStatusColor(transaction.status)">
                {{ transaction.status | titlecase }}
              </mat-chip>
            </div>
            
            <div class="detail-row" *ngIf="transaction.reference">
              <span class="label">Reference:</span>
              <span class="value">{{ transaction.reference }}</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .transaction-detail-container {
      padding: 20px;
      max-width: 600px;
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

    .transaction-details {
      display: grid;
      gap: 16px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .label {
      font-weight: 500;
      color: #666;
      min-width: 120px;
    }

    .value {
      font-weight: 500;
      text-align: right;
    }

    .amount {
      font-size: 24px;
      font-weight: 600;
    }

    .amount-credit {
      color: #4caf50;
    }

    .amount-debit {
      color: #f44336;
    }

    .type-credit {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .type-debit {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class TransactionDetailComponent implements OnInit {
  transaction: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.loadTransaction(transactionId);
    }
  }

  loadTransaction(transactionId: string) {
    // Mock data for now
    this.transaction = {
      id: transactionId,
      amount: 125.50,
      type: 'debit',
      description: 'Grocery Shopping',
      merchant: 'Fresh Market',
      category: 'Food & Dining',
      date: new Date('2024-06-25'),
      status: 'completed',
      reference: 'REF123456789'
    };
  }

  goBack() {
    this.router.navigate(['/transactions']);
  }

  getAmountClass(type: string): string {
    return `amount-${type}`;
  }

  getTypeClass(type: string): string {
    return `type-${type}`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'accent';
      case 'pending': return 'warn';
      case 'failed': return 'warn';
      default: return '';
    }
  }
}
