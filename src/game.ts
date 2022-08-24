import { Rifle, Cooldown } from './modules/rifle';

const gun = new Rifle(new GLTFShape('models/rifle.glb'), new Transform());
gun.getComponent(Transform).position.set(0.075, -0.5, 0.2);
gun.getComponent(Transform).rotation = Quaternion.Euler(-5, 0, 0);
gun.setParent(Attachable.FIRST_PERSON_CAMERA);

// Controls
const input = Input.instance;
input.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, () => {
  if (gun.hasComponent(Cooldown)) return;

  gun.playFireAnim();
});
