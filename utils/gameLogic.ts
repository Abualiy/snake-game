import {Position} from "../types";

export const generateFoodPosition = (width: number, height: number): { x: number; y: number } => {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return { x, y };
};

export const checkCollision = (head: Position, body: Position[], width: number, height: number) => {
    // Wall collision
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
        return true;
    }

    // Self collision (head matches any part of the body)
    for (let i = 1; i < body.length; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            return true;
        }
    }

    return false;
};