import * as utils from '@dcl/ecs-scene-utils';
import { Sound } from './sound';

@Component('cooldown')
export class Cooldown {}

const shotSound = new Sound(new AudioClip('sounds/shot.mp3'), false);

export class Rifle extends Entity {
  constructor(model: GLTFShape, transform: Transform) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(transform);

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(new AnimationState('Blank', { looping: false }));
    this.getComponent(Animator).addClip(new AnimationState('Fire', { looping: false }));
    this.getComponent(Animator).getClip('Blank').play();
  }

  // Play gun fire animation
  playFireAnim() {
    shotSound.getComponent(AudioSource).playOnce();
    this.stopAnimations();
    this.getComponent(Animator).getClip('Fire').play();
    this.addComponent(new Cooldown());
    this.addComponent(
      new utils.Delay(333, () => {
        this.removeComponent(Cooldown);
      }),
    );
  }

  // Bug workaround: otherwise the next animation clip won't play
  stopAnimations() {
    this.getComponent(Animator).getClip('Blank').stop();
    this.getComponent(Animator).getClip('Fire').stop();
  }
}
