import { Rifle, Cooldown } from './modules/rifle';
import { Zombie } from './modules/zombie';
import { zombieParams } from './constants';

// Gun
const gun = new Rifle(new GLTFShape('models/rifle.glb'), new Transform());
gun.getComponent(Transform).position.set(0.075, -0.5, 0.2);
gun.getComponent(Transform).rotation = Quaternion.Euler(-5, 0, 0);
gun.setParent(Attachable.FIRST_PERSON_CAMERA);

// Zombie
const zombie = new Zombie(
  new GLTFShape('models/zombie.glb'),
  new Transform({
    position: new Vector3(16, 0.933, 16),
  }),
);

// Controls
const input = Input.instance;
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, (event) => {
  if (gun.hasComponent(Cooldown)) return;

  gun.playFireAnim();

  if (event.hit?.meshName === 'Zombie_collider') {
    log(event.hit?.meshName);
  }
});

// Intermediate variables
const Player = Camera.instance;
const transform = zombie.getComponent(Transform);

class ZombieAttack implements ISystem {
  // eslint-disable-next-line class-methods-use-this
  update(dt: number) {
    // Rotate to face the player
    const lookAtTarget = new Vector3(
      Player.position.x,
      transform.position.y,
      Player.position.z,
    );

    const direction = lookAtTarget.subtract(transform.position);
    transform.rotation = Quaternion.Slerp(
      transform.rotation,
      Quaternion.LookRotation(direction),
      dt * zombieParams.ROT_SPEED,
    );

    const distance = Vector3.DistanceSquared(
      transform.position,
      Player.position,
    );

    if (distance >= 4) {
      zombie.walk();
      const forwardVector = Vector3.Forward().rotate(transform.rotation);
      const increment = forwardVector.scale(dt * zombieParams.MOVE_SPEED);
      transform.translate(increment);
    } else {
      zombie.attack();
    }
  }
}

engine.addSystem(new ZombieAttack());
