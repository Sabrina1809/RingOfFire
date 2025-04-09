import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Game } from '../../models/game';

@Component({
  selector: 'app-game',
  imports: [CommonModule,],
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

      setTimeout(() => {
        this.pickCardAnimation = false;
      },1500)
    }
  }

}
