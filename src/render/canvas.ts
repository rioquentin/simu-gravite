import type { Simulation } from "../physics/simulation";

export function render(ctx: CanvasRenderingContext2D, simulation: Simulation) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "purple"

    for (const body of simulation.bodies) {
        ctx.beginPath()
        ctx.arc(body.position.x, body.position.y, 15, 0, Math.PI * 2)
        ctx.fill()
    }
}