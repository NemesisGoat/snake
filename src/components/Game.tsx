import React, { useEffect } from "react";
import Graph, { TWIN } from "../modules/Graph/Graph";
import Head from "../modules/SnakeGame/entities/Head";
import Segment from "../modules/SnakeGame/entities/Segment";
import Snake from "../modules/SnakeGame/entities/Snake";
import BotSnake from "../modules/SnakeGame/entities/BotSnake";

export type TPoint = { x: number, y: number };

const Game: React.FC = () => {
    const WIN: TWIN = {
        LEFT: 0,
        BOTTOM: 0,
        SIDE: 10
    }

    let graph: Graph;
    let squares: TPoint[][] = [];
    let snakes: Snake[] = [];
    let locationOfFood = 0;

    const field = () => {
        let points = [];
        for (let i = WIN.BOTTOM; i < WIN.SIDE; i++) {
            for (let j = WIN.LEFT; j < WIN.SIDE; j++) {
                points.push({ x: j, y: i });
            }
        }
        for (let i = 0; i < points.length; i++) {
            if (points[i + WIN.SIDE + 1]) {
                if ((!((i + 1) % WIN.SIDE === 0)) || i === 0) {
                    squares.push([points[i], points[i + WIN.SIDE], points[i + 1 + WIN.SIDE], points[i + 1]]);
                }
            }
        }
    }

    const colorField = () => {
        squares.forEach((square, index) => {
            if (index % 2 === 0) {
                graph.polygon(square, 'green');
            } else {
                graph.polygon(square, 'lime');
            }
        })
    }

    const spawnSnake = () => {
        const pointOfStart = (squares.length - 1) / 2;
        const snake = new Snake(new Head(pointOfStart, 'right'), WIN, squares)
        snakes.push(snake)
        snake.segments.push(new Segment(snake.head, snake.head.place - 1));
        snake.segments.push(new Segment(snake.segments[snake.segments.length - 1], snake.segments[snake.segments.length - 1].place - 1));
    }

    const spawnBotSnake = () => {
        const pointOfStart = (squares.length - 1) / 2;
        const snake = new BotSnake(new Head(pointOfStart, 'right'), WIN, squares)
        snakes.push(snake)
        snake.segments.push(new Segment(snake.head, snake.head.place - 1));
        snake.segments.push(new Segment(snake.segments[snake.segments.length - 1], snake.segments[snake.segments.length - 1].place - 1));
    }

    const moveSnakes = () => {
        snakes.forEach(snake => {
            if (snake instanceof BotSnake) {
                snake.head.direction = snake.behaviour(locationOfFood);
            }
            snake.moveSnake();
        })
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.code) {
            case 'KeyW':
                if (snakes[0].head.direction !== 'down') {
                    snakes[0].head.direction = 'up';
                }
                break;
            case 'KeyD':
                if (snakes[0].head.direction !== 'left') {
                    snakes[0].head.direction = 'right';
                }
                break;
            case 'KeyS':
                if (snakes[0].head.direction !== 'up') {
                    snakes[0].head.direction = 'down';
                }
                break;
            case 'KeyA':
                if (snakes[0].head.direction !== 'right') {
                    snakes[0].head.direction = 'left';
                }
                break;
        }
    }

    const growSnake = () => {
        snakes.forEach((snake) => {
            if (snake.head.place === locationOfFood) {
                snake.growSnake();
                locationOfFood = spawnFood();
            }
        })
    }

    const spawnFood = () => {
        const location = Math.floor(Math.random() * ((WIN.SIDE - 1) ** 2 - 1));
        // segments.forEach(segment => {
        //     if (segment.place === location) {
        //         return spawnFood();
        //     }
        // });
        // if (head.place === location) {
        //     return spawnFood();
        // } 
        return location;
    }

    const changeSide = (event: React.ChangeEvent<HTMLInputElement>) => {
        WIN.SIDE = Number(event.target.value);
        squares = [];
        snakes = [];
        field();
        spawnSnake();
        growSnake();
        render();
    }

    const render = () => {
        graph.clear();
        colorField();
        moveSnakes();
        growSnake();
        snakes.forEach(snake => {
            if (snake.head.place) {
                snake.segments.forEach(segment => graph.polygon(squares[segment.place], `rgb(${snake.colors[0].r}, ${snake.colors[0].g}, ${snake.colors[0].b})`));
                graph.polygon(squares[snake.head.place], `rgb(${snake.colors[1].r}, ${snake.colors[1].g}, ${snake.colors[1].b})`);
            }
        })
        graph.polygon(squares[locationOfFood], 'red');
    }


    useEffect(() => {
        graph = new Graph('field', WIN, 600, 600);
        squares = [];
        field();
        spawnSnake();
        growSnake();
        const moving = setInterval(render, 400);
        render();
        return () => { clearInterval(moving) }
    });

    return (
        <div>
            <canvas className='field' id='field'></canvas>
            <div></div>
            <label htmlFor="side">Размер поля </label>
            <input name="side" onChange={changeSide} onKeyDown={keyDownHandler} type="range" id="side" min={8} max={42} step={2} defaultValue={10}></input>
            <button onClick={spawnBotSnake}>Добавить бота</button>
        </div>
    )
}

export default Game;