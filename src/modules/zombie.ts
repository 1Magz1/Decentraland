import * as utils from '@dcl/ecs-scene-utils';

export class Zombie extends Entity {
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
          this.destroy();
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
  }

  attack() {
    this.getComponent(Animator).getClip('Attacking').play();
  }

  walk() {
    this.getComponent(Animator).getClip('Walking').play();
  }

  stopAnimations() {
    this.getComponent(Animator).getClip('Walking').stop();
    this.getComponent(Animator).getClip('Attacking').stop();
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
