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
  pickCardAnimation = false;
  currentCard: string = '';
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

  
  // ngOnInit(): void {
  //   this.route.params.subscribe((params) => {
  //     const gameId = params['id'];
  //     this.gameId = gameId;
  
  //     runInInjectionContext(this.injector, () => {
  //       docData(doc(this.firestore, `games/${gameId}`)).subscribe((game: any) => {
  //         console.log('Live Game Update:', game);
  
  //         this.game = new Game();
  
  //         // Erst alle relevanten Daten auf this.game setzen
  //         // Object.assign(this.game, game);
  
  //         // Fallbacks setzen, falls bestimmte Daten fehlen
  //         // this.game.playedCard = Array.isArray(game.playedCard) ? game.playedCard : [];
  //         // this.game.stack = Array.isArray(game.stack) ? game.stack : [];
  //         // this.game.players = Array.isArray(game.players) ? game.players : [];
  //         // this.game.currentPlayer = typeof game.currentPlayer === 'number' ? game.currentPlayer : 0;
  
  //         this.cdr.detectChanges();
  //       });
  //     });
  //   });
  // }
  
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const gameId = params['id'];
      this.gameId = gameId;
  
      let previousGameJson = ''; // Zum Vergleich zwischenspeichern
  
      runInInjectionContext(this.injector, () => {
        docData(doc(this.firestore, `games/${gameId}`)).subscribe((game: any) => {
          const currentGameJson = JSON.stringify(game);
  
          if (currentGameJson !== previousGameJson) {
            previousGameJson = currentGameJson;
  
            this.game = new Game();
  
            // Daten manuell setzen (anstatt Object.assign, damit du volle Kontrolle hast)
            this.game.players = Array.isArray(game.players) ? game.players : [];
            this.game.stack = Array.isArray(game.stack) ? game.stack : [];
            this.game.playedCard = Array.isArray(game.playedCards) ? game.playedCards : []; // 🛑 ACHTUNG: Feldname "playedCards" (Backend) → "playedCard" (Frontend)
            this.game.currentPlayer = typeof game.currentPlayer === 'number' ? game.currentPlayer : 0;
  
            this.cdr.detectChanges();
            console.log('Live Game Update:', game);
          }
        });
      });
    });
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
        
        // Aktualisierung des currentPlayer
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

        setTimeout(() => {
            // Hier wird die Karte zu playedCard hinzugefügt
            // this.game.playedCard.push(this.currentCard);
            this.game.playedCard = [...this.game.playedCard, this.currentCard]
            
            console.log('Updated playedCards:', this.game.playedCard);
            
            this.savePlayedCards();
            this.pickCardAnimation = false;
        }, 1000);
    }
}


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        console.log(this.game.players);
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
        console.log("Spiel erfolgreich gespeichert");
    })
    .catch((error) => {
        console.error("Fehler beim Speichern des Spiels:", error);
    });
}


  savePlayedCards() {
    console.log(this.game.playedCard);
    updateDoc(doc(this.firestore, `games/${this.gameId}`), {
      playedCards: this.game.playedCard,
      stack: this.game.stack  // Auch den Stapel speichern
    })
    .then(() => {
        console.log("playedCards erfolgreich aktualisiert:", this.game.playedCard);
    })
    .catch((error) => {
        console.error("Fehler beim Speichern von playedCards:", error);
    });
}

  
}