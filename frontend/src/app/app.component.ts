import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="app-container" *ngIf="!isLoginPage">
      <app-header (menuToggle)="toggleSidenav()" [user]="currentUser"></app-header>
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #drawer class="sidenav" mode="over" [opened]="sidenavOpened">
          <app-sidenav (closeSidenav)="closeSidenav()"></app-sidenav>
        </mat-sidenav>
        <mat-sidenav-content class="main-content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
    
    <div class="auth-container" *ngIf="isLoginPage">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidenav-container {
      flex: 1;
    }

    .sidenav {
      width: 250px;
    }

    .main-content {
      padding: 20px;
      background-color: #f5f5f5;
      min-height: calc(100vh - 64px);
    }

    .auth-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
        min-height: calc(100vh - 56px);
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CapitalStream';
  sidenavOpened = false;
  isLoginPage = false;
  currentUser: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      this.isLoginPage = event.url === '/login' || event.url === '/register';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  closeSidenav(): void {
    this.sidenavOpened = false;
  }
}
