import * as utils from '@dcl/ecs-scene-utils';
import { Sound } from './sound';

export class Zombie extends Entity {
  health: number;

  sound: Sound;

  constructor(
    model: GLTFShape,
    transform: Transform,
  ) {
    super();
    engine.addEntity(this);
    this.addComponent(model);
    this.addComponent(transform);

    this.addComponent(
      new OnPointerDown(
        () => {
          this.takeDamage();
        },
        {
          button: ActionButton.POINTER,
          showFeedback: false,
          distance: 50,
        },
      ),
    );

    this.addComponent(new Animator());

    this.getComponent(Animator).addClip(
      new AnimationState('Walking', { looping: true }),
    );
    this.getComponent(Animator).addClip(
      new AnimationState('Attacking', { looping: true }),
    );

    this.health = 100;

    this.sound = new Sound(
      new AudioClip('sounds/zombie-sounds.mp3'),
      true,
      this.getComponent(Transform).position,
    );
  }

  attack() {
    this.getComponent(Animator).getClip('Attacking').play();
  }

  walk() {
    const pos = this.getComponent(Transform).position;
    this.sound.playAudioAtPosition(pos);
    this.getComponent(Animator).getClip('Walking').play();
  }

  stopAnimations() {
    this.getComponent(Animator).getClip('Walking').stop();
    this.getComponent(Animator).getClip('Attacking').stop();
  }

  takeDamage() {
    this.health -= 51 - Math.random();
    if (this.health <= 0) {
      this.destroy();
    }
  }

  destroy() {
    this.addComponent(
      new utils.Delay(250, () => {
        this.getComponent(Transform).scale.setAll(0);
        engine.removeEntity(this);
      }),
    );
  }
}
