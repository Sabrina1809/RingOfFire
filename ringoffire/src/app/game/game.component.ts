import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject, EnvironmentInjector, OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, doc, setDoc, collectionData, updateDoc, addDoc, getDoc, docData } from '@angular/fire/firestore';
import { runInInjectionContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    GameInfoComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {

  game!: Game;
  gameId: string = '';

  private injector = inject(EnvironmentInjector);

  constructor(
    private firestore: Firestore,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      this.gameId = gameId;
      let previousGameJson = '';
  
      runInInjectionContext(this.injector, () => {
        docData(doc(this.firestore, `games/${gameId}`)).subscribe((game: any) => {
          const currentGameJson = JSON.stringify(game);
  
          if (currentGameJson !== previousGameJson) {
            previousGameJson = currentGameJson;
  
            this.game = new Game();
            this.game.players = Array.isArray(game.players) ? game.players : [];
            this.game.stack = Array.isArray(game.stack) ? game.stack : [];
            this.game.playedCard = Array.isArray(game.playedCards) ? game.playedCards : []; // 🛑 ACHTUNG: Feldname "playedCards" (Backend) → "playedCard" (Frontend)
            this.game.currentPlayer = typeof game.currentPlayer === 'number' ? game.currentPlayer : 0;
            this.game.pickCardAnimation = game.pickCardAnimation;
            this.game.currentCard = game.currentCard;
            this.cdr.detectChanges();
          }
        });
      });
    });
  }
  
  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
        this.game.pickCardAnimation = true;
        this.game.currentCard = this.game.stack.pop() || '';
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

        updateDoc(doc(this.firestore, `games/${this.gameId}`), {
          pickCardAnimation: true,
          currentCard: this.game.currentCard,
          currentPlayer: this.game.currentPlayer,
          stack: this.game.stack,
        });

        setTimeout(() => {
            this.game.playedCard = [...this.game.playedCard, this.game.currentCard];
            updateDoc(doc(this.firestore, `games/${this.gameId}`), {
              playedCards: this.game.playedCard,
              pickCardAnimation: false
            });
            this.game.pickCardAnimation = false;
        }, 1000);
    }
}


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.cdr.detectChanges();
        this.saveGame();
      }
    });
  }

  saveGame() {
    const gameRef = doc(this.firestore, `games/${this.gameId}`);
    updateDoc(gameRef, {
        players: this.game.players,
        stack: this.game.stack,
        playedCards: this.game.playedCard,
        currentPlayer: this.game.currentPlayer
    })
    .then(() => {

    })
    .catch((error) => {
        console.error("Fehler beim Speichern des Spiels:", error);
    });
  }


  savePlayedCards() {
    console.log(this.game.playedCard);
    updateDoc(doc(this.firestore, `games/${this.gameId}`), {
      playedCards: this.game.playedCard,
      stack: this.game.stack
    })
    .then(() => {
     
    })
    .catch((error) => {
        console.error("Fehler beim Speichern von playedCards:", error);
    });
  }

  
}