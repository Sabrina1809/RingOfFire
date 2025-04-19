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
import { Firestore, collection, doc, setDoc, collectionData, addDoc } from '@angular/fire/firestore';
import { runInInjectionContext } from '@angular/core';

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

  private injector = inject(EnvironmentInjector);

  constructor(
    private firestore: Firestore,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.newGame();
  
    runInInjectionContext(this.injector, () => {
      const itemsCollection = collection(this.firestore, 'games');
      collectionData(itemsCollection).subscribe(game => {
        console.log('Game Update:', game);
      });
    });
  }
  
  

  newGame() {
    this.game = new Game();
    console.log(this.game);
  
    runInInjectionContext(this.injector, async () => {
      const gamesCollection = collection(this.firestore, 'games');
      await addDoc(gamesCollection, { hallo: 'welt' });
      console.log('Neues Spiel erfolgreich hinzugefügt!');
    });
  }
  

  takeCard() {
    if (!this.pickCardAnimation) {
      this.pickCardAnimation = true;
      this.currentCard = this.game.stack.pop() || '';
      console.log('currentCard:', this.currentCard);
      console.log('gezogene Karten: ', this.game.playedCard);
      console.log('verbleibende Karten: ', this.game.stack);
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
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
      }
    });
  }
}


// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { Game } from '../../models/game';
// import { PlayerComponent } from '../player/player.component';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import {ChangeDetectionStrategy} from '@angular/core';
// import {FormsModule} from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatInputModule} from '@angular/material/input';
// import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
// import { ChangeDetectorRef } from '@angular/core';
// import { GameInfoComponent } from '../game-info/game-info.component';
// import { inject } from '@angular/core';
// import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
// // import { injectFirestore } from '@angular/fire/firestore';

// export interface DialogData {
//   animal: string;
//   name: string;
// }
// @Component({
//   selector: 'app-game',
//   imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, GameInfoComponent],
//   templateUrl: './game.component.html',
//   styleUrl: './game.component.scss',
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })

// export class GameComponent {
//   pickCardAnimation = false;
//   currentCard: string = "";
//   game!: Game;
//   private firestore: Firestore = inject(Firestore);

//   constructor(
//     public dialog: MatDialog, 
//     private cdr: ChangeDetectorRef,
//     private firestore: Firestore) {
//     const gamesCollection = collection(this.firestore, 'games');
//     addDoc(gamesCollection, { player: 'Sabrina', points: 0 })
//     .then(() => console.log('Game added!'))
//     .catch(err => console.error('Error adding game:', err));
//   }


//   ngOnInit(): void {
//     this.newGame();
//     const itemsCollection = collection(this.firestore, 'items');
//     collectionData(itemsCollection).subscribe((game) => {
//       console.log('Game update', game);
//     });
    
//   }

//   newGame() {
//     this.game = new Game();
//     console.log(this.game);
    
//   }

//   takeCard() {
//     if (!this.pickCardAnimation) {

//       this.pickCardAnimation = true;
//       this.currentCard = this.game.stack.pop() || '';
//       console.log('currentCard:', this.currentCard);
//       console.log('gezogene Karten: ', this.game.playedCard);
//       console.log('verbleibende Karten: ', this.game.stack);
//       this.game.currentPlayer++;
//       this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

//       setTimeout(() => {
//         this.game.playedCard.push(this.currentCard);
//         this.pickCardAnimation = false;
//       },1000)
//     }
//   }


//   openDialog(): void {
//     const dialogRef = this.dialog.open(DialogAddPlayerComponent);

//     dialogRef.afterClosed().subscribe((name: string) => {
//       if (name && name.length > 0) {
//         this.game.players.push(name);
//         console.log(this.game.players);
    
//         this.cdr.detectChanges();

//       }
//     });
    
//   }
// }
