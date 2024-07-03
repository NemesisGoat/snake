
class Head {
    public place: number;
    public direction: string;

    constructor(pointOfStart = 0, direction = 'right') {
        this.place = pointOfStart;
        this.direction = direction;
    }
}

export default Head;