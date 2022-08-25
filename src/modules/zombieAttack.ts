import { zombieParams } from '../constants';
import { Zombie } from './zombie';

const Player = Camera.instance;

export class ZombieAttack implements ISystem {
  zombie: Zombie;

  transform: Transform;

  random: number;

  constructor(
    zombie: Zombie,
  ) {
    this.zombie = zombie;
    this.transform = zombie.getComponent(Transform);
    this.random = Math.random();
  }

  // eslint-disable-next-line class-methods-use-this
  update(dt: number) {
    const lookAtTarget = new Vector3(
      Player.position.x,
      this.transform.position.y,
      Player.position.z,
    );

    const direction = lookAtTarget.subtract(this.transform.position);

    this.transform.rotation = Quaternion.Slerp(
      this.transform.rotation,
      Quaternion.LookRotation(direction),
      dt * zombieParams.ROT_SPEED * this.random,
    );

    const distance = Vector3.DistanceSquared(
      this.transform.position,
      Player.position,
    );

    if (distance >= 4) {
      this.zombie.walk();
      const forwardVector = Vector3.Forward().rotate(this.transform.rotation);
      const increment = forwardVector.scale(
        dt * zombieParams.MOVE_SPEED * this.random,
      );
      this.transform.translate(increment);
    } else {
      this.zombie.attack();
    }
  }
}
