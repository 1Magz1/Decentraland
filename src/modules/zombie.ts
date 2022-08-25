export class Zombie extends Entity {
  constructor(
    model: GLTFShape,
    transform: Transform,
  ) {
    super();
    engine.addEntity(this);
    this.addComponent(model);
    this.addComponent(transform);

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

  static destroy() {
    log('destroy');
    // const zombie = engine.entities[id];
    // engine.removeEntity(zombie);
  }
}
