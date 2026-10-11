export class Vector {
    readonly x: number;
    readonly y: number;
    readonly z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // A function to add a vector to another one
    add(vector: Vector) : Vector {
        return new Vector(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    // A function to subtract from vector to another one
    subtract(vector: Vector) : Vector {
        return new Vector(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    // A function to multiply each part of a vector by a common number
    multiply(scalar: number) : Vector {
        return new Vector(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    // A function to get the length of a vector using Pythagorean theorem
    length() : number {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }
}
