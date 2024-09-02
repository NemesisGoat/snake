import { TSquare } from "../../../components/Game";
import { TWIN } from "../../Graph/Graph";
import Head from "./Head";
import Snake from "./Snake";


class BotSnake extends Snake {

    constructor(head: Head, WIN: TWIN, squares: TSquare[], colors = []) {
        super(head, WIN, squares, colors);
    }


    behaviour = (locationOfFood: number) => {
        const distance = locationOfFood - this.head.place;
        if (distance > 0 && distance < (this.WIN.SIDE)) {
            if (this.squares[this.head.place + 1] && this.squares[this.head.place + 1].taken === false) {
                return 'right';
            } else if (this.squares[this.head.place + this.WIN.SIDE] && this.squares[this.head.place + this.WIN.SIDE].taken === false) {
                return 'up';
            } else if (this.squares[this.head.place - this.WIN.SIDE] && this.squares[this.head.place - this.WIN.SIDE].taken === false) {
                return 'down';
            }
        }
        if (distance < 0 && distance > -this.WIN.SIDE) {
            if (this.squares[this.head.place - 1] && this.squares[this.head.place - 1].taken === false) {
                return 'left';
            } else if (this.squares[this.head.place - this.WIN.SIDE] && this.squares[this.head.place - this.WIN.SIDE].taken === false) {
                return 'down';
            } else if (this.squares[this.head.place + this.WIN.SIDE] && this.squares[this.head.place + this.WIN.SIDE].taken === false) {
                return 'up';
            }
        }
        if ((distance > 0 && distance >= (this.WIN.SIDE))) {
            if (this.squares[this.head.place + this.WIN.SIDE] && this.squares[this.head.place + this.WIN.SIDE].taken === false) {
                return 'up';
            } else if (this.squares[this.head.place + 1] && this.squares[this.head.place + 1].taken === false) {
                return 'right';
            } else if (this.squares[this.head.place - 1] && this.squares[this.head.place - 1].taken === false) {
                return 'left';
            }
        }
        if ((distance < 0 && distance <= -(this.WIN.SIDE))) {
            if (this.squares[this.head.place - this.WIN.SIDE] && this.squares[this.head.place - this.WIN.SIDE].taken === false) {
                return 'down';
            } else if (this.squares[this.head.place + 1] && this.squares[this.head.place + 1].taken === false) {
                return 'right';
            } else if (this.squares[this.head.place - 1] && this.squares[this.head.place - 1].taken === false) {
                return 'left';
            }
        }
        return this.head.direction;
    }

    
}

export default BotSnake;