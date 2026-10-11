import { Body } from "./body";
import type { Vector } from "./vector";

const gravity = 1;
const softening = 10;

export function accel(bodyA: Body, bodyB: Body) : Vector {

    const direction = bodyB.position.subtract(bodyA.position);
    const distance = direction.length()
    const intensity = (gravity * bodyB.mass) / (((distance ** 2) + (softening ** 2)) ** 1.5)
    return direction.multiply(intensity)
}