import { Rifle, Cooldown } from './modules/rifle';
import { ZombieController } from './modules/zombieController';

// Gun
const gun = new Rifle(new GLTFShape('models/rifle.glb'), new Transform());
gun.getComponent(Transform).position.set(0.075, -0.5, 0.2);
gun.getComponent(Transform).rotation = Quaternion.Euler(-5, 0, 0);
gun.setParent(Attachable.FIRST_PERSON_CAMERA);

// Multiple Zombie Cast
const zombieController = new ZombieController();

onSceneReadyObservable.add(() => {
  zombieController.spawnZombies();
});

// Controls
const input = Input.instance;
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, (event) => {
  if (gun.hasComponent(Cooldown)) return;

  gun.playFireAnim();

  if (event.hit?.meshName === 'Zombie_collider') {
    const object = engine.entities[event.hit?.entityId];
    engine.removeEntity(object);
  }
});
