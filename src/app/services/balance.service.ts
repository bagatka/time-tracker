import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private balanceKey = 'balance';
  private balanceHistoryKey = 'balanceHistory';
  private readonly localStorageService = new LocalStorageService();

  getBalance(): number {
    return this.localStorageService.get(this.balanceKey) ?? 0;
  }

  addBalance(amount: number): void {
    const balance = this.getBalance();
    const history = this.localStorageService.get(this.balanceHistoryKey) ?? [];
    history.push({ date: new Date().toISOString(), balanceFrom: balance, balanceTo: balance + amount });
    this.localStorageService.set(this.balanceHistoryKey, history);
    this.localStorageService.set(this.balanceKey, balance + amount);
  }

  subtractBalance(amount: number): void {
    const balance = this.getBalance();
    const history = this.localStorageService.get(this.balanceHistoryKey) ?? [];
    history.push({ date: new Date().toISOString(), balanceFrom: balance, balanceTo: balance - amount });
    this.localStorageService.set(this.balanceHistoryKey, history);
    this.localStorageService.set(this.balanceKey, balance - amount);
  }
}

interface BalanceHistory {
  date: string;
  balanceFrom: number;
  balanceTo: number;
}
