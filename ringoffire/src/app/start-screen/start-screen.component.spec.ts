import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartScreenComponent } from './start-screen.component';
import { GameComponent } from '../game/game.component';


describe('StartScreenComponent', () => {
  let component: StartScreenComponent;
  let fixture: ComponentFixture<StartScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartScreenComponent, GameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
