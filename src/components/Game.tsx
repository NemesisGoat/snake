import React, { useEffect } from "react";
import Graph, { TWIN } from "../modules/Graph/Graph";
import Head from "../modules/SnakeGame/entities/Head";
import Segment from "../modules/SnakeGame/entities/Segment";
import Snake from "../modules/SnakeGame/entities/Snake";
import BotSnake from "../modules/SnakeGame/entities/BotSnake";

export type TPoint = { x: number, y: number };
export type TSquare = {num: TPoint[], taken: boolean};

const Game: React.FC = () => {
    const WIN: TWIN = {
        LEFT: 0,
        BOTTOM: 0,
        SIDE: 10
    }

    let graph: Graph;
    let squares: TSquare[] = [];
    let snakes: Snake[] = [];
    let locationOfFood = 0;
    let locationOfBoostUp = 0;
    let locationOfBoostDown = 0;

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
                    squares.push({num: [points[i], points[i + WIN.SIDE], points[i + 1 + WIN.SIDE], points[i + 1]], taken: false});
                }
            }
        }
    }

    const colorField = () => {
        squares.forEach((square, index) => {
            if (index % 2 === 0) {
                graph.polygon(square.num, 'green');
            } else {
                graph.polygon(square.num, 'lime');
            }
        })
    }

    const spawnSnake = () => {
        const pointOfStart = (squares.length - 1) / 2;
        const snake = new Snake(new Head(pointOfStart, 'right'), WIN, squares)
        snakes.push(snake)
        snake.segments.push(new Segment(snake.head, snake.head.place - 1));
        snake.segments.push(new Segment(snake.segments[snake.segments.length - 1], snake.segments[snake.segments.length - 1].place - 1));
        console.log(snakes);
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
        })
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (snakes[0].canMove) {
            switch (event.code) {
                case 'KeyW':
                    if (snakes[0].head.direction !== 'down') {
                        snakes[0].canMove = false;
                        snakes[0].head.direction = 'up';
                    }
                    break;
                case 'KeyD':
                    if (snakes[0].head.direction !== 'left') {
                        snakes[0].canMove = false;
                        snakes[0].head.direction = 'right';
                    }
                    break;
                case 'KeyS':
                    if (snakes[0].head.direction !== 'up') {
                        snakes[0].canMove = false;
                        snakes[0].head.direction = 'down';
                    }
                    break;
                case 'KeyA':
                    if (snakes[0].head.direction !== 'right') {
                        snakes[0].canMove = false;
                        snakes[0].head.direction = 'left';
                    }
                    break;
            }
        }
    }

    const changeHeadColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        snakes[0].colors[1] = event.target.value;
    }
    const changeBodyColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        snakes[0].colors[0] = event.target.value;
    }

    const growSnake = () => {
        snakes.forEach((snake) => {
            if (snake.head.place === locationOfFood) {
                snake.growSnake();
                locationOfFood = spawnFood();
            }
        })
    }
    
    const boostUpSnake = () => {
        snakes.forEach((snake) => {
            if (snake.head.place === locationOfBoostUp) {
                snake.changeSpeed(200);
                locationOfBoostUp = -1;
                setTimeout(() => locationOfBoostUp = spawnBoostDown(), 10000)
            }
        })
    }
    
    const boostDownSnake = () => {
        snakes.forEach((snake) => {
            if (snake.head.place === locationOfBoostDown) {
                snake.changeSpeed(-200);
                locationOfBoostDown = -1;
                setTimeout(() => locationOfBoostDown = spawnBoostDown(), 10000)
            }
        })
    }

    const spawnFood: any = () => {
        const location = Math.floor(Math.random() * ((WIN.SIDE - 1) ** 2 - 1));
        if (squares[location].taken) {
            return spawnFood();
        } 
        return location;
    }

    const spawnBoostUp: any = () => {
        const location = Math.floor(Math.random() * ((WIN.SIDE - 1) ** 2 - 1));
        if (squares[location].taken) {
            return spawnBoostUp();
        } 
        return location;
    }
    
    const spawnBoostDown: any = () => {
        const location = Math.floor(Math.random() * ((WIN.SIDE - 1) ** 2 - 1));
        if (squares[location].taken) {
            return spawnBoostDown();
        } 
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
        boostUpSnake();
        boostDownSnake();
        snakes.forEach(snake => {
            if (snake.head.place) {
                snake.segments.forEach(segment => graph.polygon(squares[segment.place].num, snake.colors[0]));
                graph.polygon(squares[snake.head.place].num, snake.colors[1]);
            }
        })
        graph.polygon(squares[locationOfFood].num, 'red');
        if (locationOfBoostUp != -1) {
            graph.polygon(squares[locationOfBoostUp].num, 'pink');
        }
        if (locationOfBoostDown != -1) {
            graph.polygon(squares[locationOfBoostDown].num, 'olive');
        }
    }


    useEffect(() => {
        graph = new Graph('field', WIN, 600, 600);
        snakes = [];
        squares = [];
        field();
        spawnSnake();
        const moving = setInterval(render, 100);
        render();
        return () => { clearInterval(moving) }
    });

    return (
        <div>
            <canvas className='field' id='field' onKeyDown={keyDownHandler} tabIndex={0}></canvas>
            <div></div>
            <label htmlFor="side">Размер поля </label>
            <input name="side" onChange={changeSide} type="range" id="side" min={8} max={42} step={2} defaultValue={10}></input>
            <button onClick={spawnBotSnake}>Добавить бота</button>
            <input type="color" onChange={changeHeadColor}></input>
            <input type="color" onChange={changeBodyColor}></input>
        </div>
    )
}

export default Game;