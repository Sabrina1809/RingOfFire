import { Component, Input, OnChanges } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-game-info',
  imports: [MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss'
})
export class GameInfoComponent implements OnChanges {
  cardAction = [
    {
      "title": "Ass",
      "description": "Wasserfall – Alle trinken gleichzeitig, und niemand darf vor dem linken Nachbarn aufhören."
    },
    {
      "title": "2",
      "description": "Du – Du bestimmst, wer trinken muss."
    },
    {
      "title": "3",
      "description": "Ich – Du selbst musst trinken."
    },
    {
      "title": "4",
      "description": "Frauen – Alle Frauen trinken."
    },
    {
      "title": "5",
      "description": "Regel – Du darfst eine neue Regel einführen, die ab jetzt für das Spiel gilt."
    },
    {
      "title": "6",
      "description": "Männer – Alle Männer trinken."
    },
    {
      "title": "7",
      "description": "Himmel – Alle müssen die Hand heben, der letzte trinkt."
    },
    {
      "title": "8",
      "description": "Partner – Du wählst einen Trinkpartner. Wenn du trinkst, muss er/sie auch trinken – und umgekehrt."
    },
    {
      "title": "9",
      "description": "Reim – Du sagst ein Wort, und reihum müssen sich alle ein Reimwort einfallen lassen. Wer scheitert, trinkt."
    },
    {
      "title": "10",
      "description": "Kategorie – Du wählst eine Kategorie (z. B. Automarken), und jeder muss ein passendes Wort nennen. Wer scheitert, trinkt."
    },
    {
      "title": "Bube",
      "description": "Frage – Du stellst jemandem eine Frage. Diese Person muss direkt eine neue Frage stellen. Wer zögert oder lacht, trinkt."
    },
    {
      "title": "Dame",
      "description": "Klofrau – Du darfst niemandem mehr etwas direkt geben. Alles muss auf den Tisch gelegt werden."
    },
    {
      "title": "König",
      "description": "Kings Cup – Du schüttest etwas von deinem Getränk in das Glas in der Mitte. Wer den letzten König zieht, muss es trinken."
    }
  ];

  title = '';
  description = '';

  @Input() card?: string;
  
  constructor() {

  }

  ngOnInit(): void {
   
  }

  ngOnChanges(): void {
    console.log('current card: ', this.card)
    if (this.card) {
      console.log(   console.log('current card: ', this.card));
      
      let cardNumber = Number(this.card?.split('_')[1]);
      console.log('number: ', cardNumber);
      
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }
   
  }
}
