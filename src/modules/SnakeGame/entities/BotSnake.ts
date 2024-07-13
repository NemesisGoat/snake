import { TPoint } from "../../../components/Game";
import { TWIN } from "../../Graph/Graph";
import Head from "./Head";
import Snake from "./Snake";


class BotSnake extends Snake {

    constructor (head:Head, WIN:TWIN, squares:TPoint[][], colors = []) {
        super(head, WIN, squares, colors);
    }
    
    
    behaviour = (locationOfFood: number) => {
        const distance = locationOfFood - this.head.place;
        if (distance > 0 && distance < (this.WIN.SIDE - 1)) {
            return 'right';
        }
        if (distance < 0 && distance > -(this.WIN.SIDE - 1)) {
            return 'left';
        }
        if ((distance > 0 && distance > (this.WIN.SIDE - 1)) || distance === (this.WIN.SIDE - 1)) {
            return 'up';
        }
        if ((distance < 0 && distance < -(this.WIN.SIDE - 1)) || distance === -(this.WIN.SIDE - 1)) {
            return 'down';
        }
        return 'right';
    }
}

export default BotSnake;