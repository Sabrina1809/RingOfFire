// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { Firestore } from '@angular/fire/firestore';

// @Component({
//   selector: 'app-start-screen',
//   imports: [CommonModule],
//   templateUrl: './start-screen.component.html',
//   styleUrl: './start-screen.component.scss'
// })
// export class StartScreenComponent {

//   constructor(
//     private router: Router,
//      private firestore: Firestore
//   ) {
    
//   }

//   newGame() {
//     console.log('start game');
//     let game = new Game();
//     this.firestore.collection('games').add(game.toJson()).then((gameInfo: any) => {
//       console.log(gameInfo);
      
//     })
//     this.router.navigateByUrl('/game/DmxF3fGtpx3ieFBBFjRN')
//   }
// }


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game'; // Passe den Pfad ggf. an!

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(
    private router: Router,
    private firestore: Firestore
  ) {}

  async newGame() {
    console.log('start game');
    const game = new Game();
    // const gamesCollection = collection(this.firestore, 'games');

    try {
      const gameRef = await addDoc(collection(this.firestore, 'games'), game.toJson());
      console.log('Game created with ID:', gameRef.id);
      this.router.navigateByUrl('/game/' + gameRef.id);
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }
}
