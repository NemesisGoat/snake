import Head from "./Head";

class Segment {
    public next;
    public place;

    constructor (next: Segment | Head, place = 0) {
        this.next = next;
        this.place = place;
    }
}

export default Segment;