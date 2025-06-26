import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-transaction',
  standalone: false,
  template: `
    <div class="create-transaction-container">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>New Transaction</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Account</mat-label>
              <mat-select formControlName="accountId" required>
                <mat-option *ngFor="let account of accounts" [value]="account.id">
                  {{ account.name }} ({{ account.number }})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="transactionForm.get('accountId')?.hasError('required')">
                Please select an account
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Transaction Type</mat-label>
              <mat-select formControlName="type" required>
                <mat-option value="debit">Debit (Expense)</mat-option>
                <mat-option value="credit">Credit (Income)</mat-option>
              </mat-select>
              <mat-error *ngIf="transactionForm.get('type')?.hasError('required')">
                Please select a transaction type
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Amount</mat-label>
              <input matInput type="number" step="0.01" formControlName="amount" required>
              <span matPrefix>$&nbsp;</span>
              <mat-error *ngIf="transactionForm.get('amount')?.hasError('required')">
                Amount is required
              </mat-error>
              <mat-error *ngIf="transactionForm.get('amount')?.hasError('min')">
                Amount must be greater than 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description" required>
              <mat-error *ngIf="transactionForm.get('description')?.hasError('required')">
                Description is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category" required>
                <mat-option *ngFor="let category of categories" [value]="category">
                  {{ category }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="transactionForm.get('category')?.hasError('required')">
                Please select a category
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Merchant (Optional)</mat-label>
              <input matInput formControlName="merchant">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date" required>
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="transactionForm.get('date')?.hasError('required')">
                Date is required
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="transactionForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                {{ isLoading ? 'Creating...' : 'Create Transaction' }}
              </button>
            </div>
          </form>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .create-transaction-container {
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

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .error-message {
      color: #f44336;
      margin-top: 16px;
      text-align: center;
    }
  `]
})
export class CreateTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  accounts = [
    { id: '1', name: 'Primary Checking', number: '****1234' },
    { id: '2', name: 'Emergency Savings', number: '****5678' },
    { id: '3', name: 'Rewards Credit Card', number: '****9012' }
  ];

  categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Income',
    'Transfer',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.transactionForm = this.fb.group({
      accountId: ['', Validators.required],
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      merchant: [''],
      date: [new Date(), Validators.required]
    });
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // TODO: Implement transaction creation service call
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/transactions']);
      }, 1000);
    }
  }

  goBack() {
    this.router.navigate(['/transactions']);
  }
}
