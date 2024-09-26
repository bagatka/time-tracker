import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocalStorageService } from '../../services/local-storage.service';
import confetti from 'canvas-confetti';
import { BalanceService } from '../../services/balance.service';

@Component({
  standalone: true,
  selector: 'indicator-line',
  templateUrl: './indicator-line.component.html',
  styleUrls: ['./indicator-line.component.scss'],
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule
  ]
})
export class IndicatorLineComponent implements OnInit {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly balanceService = inject(BalanceService);
  collectablePrizes: CollectablePrize[] = [];

  @Input() maxValue!: number;
  @Input() currentValue!: number;
  @Input() prizes: Prize[] = [];

  @Output() balanceChanged = new EventEmitter();

  ngOnInit(): void {
    const collectedPrizes = this.localStorageService.get('collectedPrizes') ?? [];
    this.collectablePrizes = this.prizes.map((prize) => {
      return {
        ...prize,
        collected: collectedPrizes.includes(this.prizeKey(prize))
      };
    });
  }

  // Function to calculate the position of each prize relative to the maxValue
  calculatePrizePosition(value: number): string {
    const positionPercentage = (value / this.maxValue) * 100;
    return `${positionPercentage}%`;
  }

  openPrizeDialog(prize: CollectablePrize) {
    if (prize.collected) {
      return;
    }

    const prizeKey = this.prizeKey(prize);
    prize.collected = true;
    const collectedPrizes = this.localStorageService.get('collectedPrizes') ?? [];
    if (collectedPrizes.includes(prizeKey)) {
      return;
    }

    collectedPrizes.push(prizeKey);
    this.localStorageService.set('collectedPrizes', collectedPrizes);
    this.balanceService.addBalance(prize.starsValue);
    this.balanceChanged.emit();

    const duration = 5000; // in milliseconds

    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: Math.random(), x: Math.random() },
    });
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: Math.random(), x: Math.random() },
    });
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: Math.random(), x: Math.random() },
    });
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: Math.random(), x: Math.random() },
    });
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: Math.random(), x: Math.random() },
    });
    confetti({
      particleCount: 140,
      spread: 100,
      origin: { y: Math.random(), x: Math.random() },
    });

    setTimeout(() => confetti.reset(), duration);
  }

  private prizeKey(prize: Prize): string {
    const today = new Date();
    const date = today.toDateString();
    return `${date}_${prize.name}`;
  }
}


export interface Prize {
  name: string;
  collectableAtValue: number;
  starsValue: number;
}

export interface CollectablePrize extends Prize {
  collected: boolean;
}
