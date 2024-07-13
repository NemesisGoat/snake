import { TPoint } from "../../../components/Game";
import { TWIN } from "../../Graph/Graph";
import Head from "./Head";
import Segment from "./Segment";

type color = {r:number, g:number, b:number};

class Snake {
    public segments: Segment[];
    public head: Head;
    public WIN: TWIN;
    private squares: TPoint[][];
    public colors: color[];

    constructor(head:Head, WIN:TWIN, squares:TPoint[][], colors = []) {
        this.segments = [];
        this.head = head;
        this.WIN = WIN;
        this.squares = squares;
        this.colors = colors;
        if (colors.length === 0) {
            this.colors = [
                {r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255},
                {r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255}
            ]; 
        }
    }

    growSnake = () => {
        this.segments.push(new Segment(this.segments[this.segments.length - 1], this.segments[this.segments.length - 1].place))
    }

    moveSnake = () => {
        for (let i = this.segments.length - 1; i >= 0; i--) {
            this.segments[i].place = this.segments[i].next.place;
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
        // this.segments.forEach(segment => {
        //     if (this.head.place === segment.place) {
        //         this.segments = []
        //         this.head.direction = 'right';
        //         spawnSnake();
        //     }
        // })
    }

}

export default Snake;