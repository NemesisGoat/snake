import React, { useEffect } from "react";
import Graph, { TWIN } from "../modules/Graph/Graph";
import Head from "../modules/SnakeGame/entities/Head";
import Segment from "../modules/SnakeGame/entities/Segment";

export type TPoint = { x: number, y: number };

const Game: React.FC = () => {
    const WIN: TWIN = {
        LEFT: 0,
        BOTTOM: 0,
        SIDE: 10
    }

    let graph: Graph;
    let squares: TPoint[][] = [];
    let segments: Segment[] = [];
    let locationOfFood = 0;
    const head = new Head();

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
        head.place = pointOfStart;
        segments.push(new Segment(head, head.place - 1));
        segments.push(new Segment(segments[segments.length - 1], segments[segments.length - 1].place - 1));
    }

    const moveSnake = () => {
        for (let i = segments.length - 1; i >= 0; i--) {
            segments[i].place = segments[i].next.place;
        }
        switch (head.direction) {
            case 'right':
                if ((head.place + 1) % (WIN.SIDE - 1) === 0) {
                    head.place = head.place - WIN.SIDE + 2;
                } else {
                    head.place++;
                }
                break;
            case 'left':
                if ((head.place) % (WIN.SIDE - 1) === 0) {
                    head.place = head.place + WIN.SIDE - 2;
                } else {
                    head.place--;
                }
                break;
            case 'up':
                if ((head.place + WIN.SIDE - 1) > squares.length - 1) {
                    head.place = head.place - (WIN.SIDE - 1) * (WIN.SIDE - 2);
                } else {
                    head.place = head.place + WIN.SIDE - 1;
                }
                break;
            case 'down':
                if ((head.place - WIN.SIDE + 1) < 0) {
                    head.place = head.place + (WIN.SIDE - 1) * (WIN.SIDE - 2);
                } else {
                    head.place = head.place - WIN.SIDE + 1;
                }
                break;
        }
        segments.forEach(segment => {
            if (head.place === segment.place) {
                segments = []
                head.direction = 'right';
                spawnSnake();
            }
        })
        if (head.place === locationOfFood) {
            growSnake();
        }
        render();
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.code) {
            case 'KeyW':
                if (head.direction !== 'down') {
                    head.direction = 'up';
                }
                break;
            case 'KeyD':
                if (head.direction !== 'left') {
                    head.direction = 'right';
                }
                break;
            case 'KeyS':
                if (head.direction !== 'up') {
                    head.direction = 'down';
                }
                break;
            case 'KeyA':
                if (head.direction !== 'right') {
                    head.direction = 'left';
                }
                break;
        }
    }

    const growSnake = () => {
        segments.push(new Segment(segments[segments.length - 1], segments[segments.length - 1].place))
        locationOfFood = spawnFood();
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
        segments = [];
        field();
        spawnSnake();
        growSnake();
        render();
    }

    const render = () => {
        graph.clear();
        colorField();
        if (head.place) {
            segments.forEach(segment => graph.polygon(squares[segment.place], 'gold'));
            graph.polygon(squares[head.place], 'yellow');
        }
        graph.polygon(squares[locationOfFood], 'red');
    }


    useEffect(() => {
        graph = new Graph('field', WIN, 600, 600);
        squares = [];
        field();
        spawnSnake();
        growSnake();
        const moving = setInterval(moveSnake, 400);
        render();
        return () => { clearInterval(moving) }
    });

    return (
        <div>
            <canvas className='field' id='field'></canvas>
            <div></div>
            <label htmlFor="side">Размер поля </label>
            <input name="side" onChange={changeSide} onKeyDown={keyDownHandler} type="range" id="side" min={8} max={42} step={2} defaultValue={10}></input>
        </div>
    )
}

export default Game;