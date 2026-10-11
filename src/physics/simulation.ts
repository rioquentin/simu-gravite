import { Body } from "./body";
import { accel } from "./gravitation";
import { Vector } from "./vector";

export class Simulation {
    bodies: Body[] = [];

    addBody(body: Body) : void {
        this.bodies.push(body)
    }

    step(dt: number) : void {
        for(const body of this.bodies) {
            let total = new Vector(0, 0, 0);
            for (const other of this.bodies) {
                if (other === body) {
                    continue
                }
                const a = accel(body, other);
                total = total.add(a)
            }
            body.acceleration = total;
        }
        for(const body of this.bodies) {
            body.velocity = body.velocity.add(body.acceleration.multiply(dt))
            const displacement = body.velocity.multiply(dt)
            body.position = body.position.add(displacement)
        }
    }
}
