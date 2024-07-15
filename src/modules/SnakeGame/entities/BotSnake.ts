import { TPoint, TSquare } from "../../../components/Game";
import { TWIN } from "../../Graph/Graph";
import Head from "./Head";
import Snake from "./Snake";


class BotSnake extends Snake {

    constructor (head:Head, WIN:TWIN, squares:TSquare[], colors = []) {
        super(head, WIN, squares, colors);
    }
    
    
    behaviour = (locationOfFood: number) => {
        const distance = locationOfFood - this.head.place;
        if (distance > 0 && distance < (this.WIN.SIDE - 1) && this.head.direction != 'left') {
            return 'right';
        }
        if (distance < 0 && distance > -(this.WIN.SIDE - 1) && this.head.direction != 'right') {
            return 'left';
        }
        if ((distance > 0 && distance > (this.WIN.SIDE - 1)) || distance === (this.WIN.SIDE - 1) && this.head.direction != 'down') {
            return 'up';
        }
        if ((distance < 0 && distance < -(this.WIN.SIDE - 1)) || distance === -(this.WIN.SIDE - 1) && this.head.direction != 'up') {
            return 'down';
        }
        return this.head.direction;
    }
}

export default BotSnake;