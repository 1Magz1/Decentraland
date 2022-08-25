import * as utils from '@dcl/ecs-scene-utils';
import { Zombie } from './zombie';
import { ZombieAttack } from './zombieAttack';
import { zombieParams } from '../constants';

const physicsCast = PhysicsCast.instance;

export class ZombieController {
  center: Vector3;

  sideLength = 10;

  amount = zombieParams.AMOUNT;

  spacing: number = this.sideLength / this.amount;

  base: Vector3 = new Vector3(14, 0, 14);

  constructor() {
    this.center = new Vector3(24, 0.8, 24);

    this.base = new Vector3(
      this.center.x - this.sideLength / 2,
      this.center.y,
      this.center.z - this.sideLength / 2,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  spawnEnemy(newPos: Vector3) {
    const zombie = new Zombie(
      new GLTFShape('models/zombie.glb'),
      new Transform({
        position: newPos,
        rotation: Quaternion.Euler(0, Math.random() * 360, 0),
      }),
    );
    engine.addEntity(zombie);
    engine.addSystem(new ZombieAttack(zombie));
  }

  spawn() {
    for (let i = 0; i < this.amount; i += 1) {
      const newPos = new Vector3(
        this.base.x + i * this.spacing + Math.random() * 20 - 10,
        this.base.y,
        this.base.z + i * this.spacing + Math.random() * 10 - 20,
      );

      const rayDown: Ray = {
        origin: new Vector3(newPos.x, 20, newPos.z),
        direction: Vector3.Down(),
        distance: 22,
      };

      physicsCast.hitAll(
        rayDown,
        (e) => {
          this.spawnEnemy(newPos);
        },
      );
    }
  }

  timerSpawn() {
    const timer = new Entity();

    timer.addComponent(
      new utils.Interval(
        zombieParams.BASE_SPAWN_TIME + Math.random() * zombieParams.MAX_TIME_OFFSET,
        () => {
          const pos = new Vector3(
            this.base.x + this.spacing + Math.random() * 25 - 25,
            this.base.y,
            this.base.z + this.spacing + Math.random() * 25 - 25,
          );
          this.spawnEnemy(pos);
        },
      ),
    );
    engine.addEntity(timer);
  }
}
