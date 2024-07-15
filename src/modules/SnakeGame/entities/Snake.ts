import { TPoint, TSquare } from "../../../components/Game";
import { TWIN } from "../../Graph/Graph";
import Head from "./Head";
import Segment from "./Segment";

type color = { r: number, g: number, b: number };

class Snake {
    public segments: Segment[];
    public head: Head;
    public WIN: TWIN;
    private squares: TSquare[];
    public colors: string[];
    public canMove: boolean;
    public speed: number;
    private moving: any;

    constructor(head: Head, WIN: TWIN, squares: TSquare[], colors = [], speed = 600) {
        this.segments = [];
        this.head = head;
        this.WIN = WIN;
        this.squares = squares;
        this.colors = colors;
        this.speed = speed;
        if (colors.length === 0) {
            this.colors = [
                `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
                `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
            ];
        }
        this.canMove = true;
        this.moving = setInterval(this.moveSnake, 1000 - speed);
    }

    growSnake = () => {
        this.segments.push(new Segment(this.segments[this.segments.length - 1], this.segments[this.segments.length - 1].place))
    }

    moveSnake = () => {
        this.canMove = true;
        this.squares[this.segments[this.segments.length - 1].place].taken = false;
        for (let i = this.segments.length - 1; i >= 0; i--) {
            this.segments[i].place = this.segments[i].next.place;
            this.squares[this.segments[i].place].taken = true;
        }
        switch (this.head.direction) {
            case 'right':
                if ((this.head.place + 1) % (this.WIN.SIDE - 1) === 0) {
                    this.head.place = this.head.place - this.WIN.SIDE + 2;
                } else {
                    this.head.place++;
                }
                break;
            case 'left':
                if ((this.head.place) % (this.WIN.SIDE - 1) === 0) {
                    this.head.place = this.head.place + this.WIN.SIDE - 2;
                } else {
                    this.head.place--;
                }
                break;
            case 'up':
                if ((this.head.place + this.WIN.SIDE - 1) > this.squares.length - 1) {
                    this.head.place = this.head.place - (this.WIN.SIDE - 1) * (this.WIN.SIDE - 2);
                } else {
                    this.head.place = this.head.place + this.WIN.SIDE - 1;
                }
                break;
            case 'down':
                if ((this.head.place - this.WIN.SIDE + 1) < 0) {
                    this.head.place = this.head.place + (this.WIN.SIDE - 1) * (this.WIN.SIDE - 2);
                } else {
                    this.head.place = this.head.place - this.WIN.SIDE + 1;
                }
                break;
        }
        if (this.squares[this.head.place].taken) {
            this.respawnSnake();
        }
        this.squares[this.head.place].taken = true;
        // this.segments.forEach(segment => {
        //     if (this.head.place === segment.place) {
        //         this.segments = []
        //         this.head.direction = 'right';
        //         spawnSnake();
        //     }
        // })
    }

    changeSpeed = (boost: number) => {
        this.speed = this.speed + boost;
        clearInterval(this.moving);
        this.moving = setInterval(this.moveSnake, 1000 - this.speed);
        setTimeout(() => {
            this.speed = this.speed - boost;
            clearInterval(this.moving);
            this.moving = setInterval(this.moveSnake, 1000 - this.speed);
        }, 5000);

    }

    respawnSnake: any = () => {
        this.segments.forEach(segment => {
            this.squares[segment.place].taken = false;
        })
        this.squares[this.head.place].taken = false;
        this.segments = [];
        this.head.place = Math.floor(Math.random() * this.squares.length);
        if (this.squares[this.head.place].taken) return (this.respawnSnake());
        this.segments.push(new Segment(this.head, this.head.place));
        this.segments.push(new Segment(this.segments[this.segments.length - 1], this.segments[this.segments.length - 1].place));
    }

}

export default Snake;