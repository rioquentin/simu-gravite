import { Vector } from "./vector";

export class Body {

    position: Vector;
    velocity: Vector;
    mass: number;
    acceleration: Vector = new Vector(0, 0, 0);
    
    constructor(position: Vector, velocity: Vector, mass: number) {
        this.position = position;
        this.velocity = velocity;
        this.mass = mass;
    }
}