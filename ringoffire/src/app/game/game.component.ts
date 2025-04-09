import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  imports: [CommonModule, PlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})

export class GameComponent {
  pickCardAnimation = false;
  currentCard: string = "";
  game!: Game;

  constructor() {
    
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
    
  }

  takeCard() {
    if (!this.pickCardAnimation) {

      this.pickCardAnimation = true;
      this.currentCard = this.game.stack.pop() || '';
      console.log('currentCard:', this.currentCard);
      console.log('gezogene Karten: ', this.game.playedCard);
      console.log('verbleibende Karten: ', this.game.stack);
      
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      },1000)
    }
  }
}
