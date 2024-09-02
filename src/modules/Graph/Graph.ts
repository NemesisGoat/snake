export type TWIN = {
    LEFT: number;
    BOTTOM: number;
    SIDE: number;
}

class Graph {
    private canvas: HTMLCanvasElement;
    private canvasV: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private contextV: CanvasRenderingContext2D;
    private WIN: TWIN;

    constructor(id: string, WIN: TWIN, height: number, width: number) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.canvas.height = height;
        this.canvas.width = width;
        this.canvasV = document.createElement('canvas');
        this.canvasV.width = width;
        this.canvasV.height = height;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.contextV = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.WIN = WIN;
        this.canvas.focus()
    }

    xs(x: number): number {
        return (x - this.WIN.LEFT) / this.WIN.SIDE * this.canvasV.width;
    }
    ys(y: number): number {
        return (this.WIN.SIDE - (y - this.WIN.BOTTOM)) / this.WIN.SIDE * this.canvasV.height;
    }

    sx(x: number): number {
        return x * this.WIN.SIDE / this.canvasV.width;
    }
    sy(y: number): number {
        return -y * this.WIN.SIDE / this.canvasV.height;
    }

    clear(): void {
        this.contextV.clearRect(0, 0, this.canvasV.width, this.canvasV.height)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    line(x1: number, y1: number, x2: number, y2: number, color = 'black', width = 2): void {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.moveTo(this.xs(x1), this.ys(y1));
        this.contextV.lineTo(this.xs(x2), this.ys(y2));
        this.contextV.stroke();
        this.contextV.closePath();
    }

    point(x: number, y: number, color = '#b55a5d', size = 2): void {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.fillStyle = color;
        this.contextV.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.contextV.stroke();
        this.contextV.fill();
        this.contextV.closePath();
    }

    polygon(points:{x: number, y: number}[], color = 'green'): void {
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.context.closePath();
        this.context.fill();
    }

    print(
        x: number,
        y: number,
        text: string,
        color = '#000',
        size = 350,
        isGraphName = true
    ): void {
        this.contextV.font = size / this.WIN.SIDE + "px Verdana";
        this.contextV.fillStyle = color;
        this.contextV.fillText(text, this.xs(x), this.ys(y));
        this.contextV.stroke();
    };

    drawBackground(image: any): void {
        this.contextV.drawImage(image, 0, 0, this.canvasV.height, this.canvasV.width)
    }

    drawImage(image: any, x: number, y: number, side: number) {
        this.contextV.drawImage(image, this.xs(x), this.ys(y), this.canvasV.height / side, this.canvasV.width / side)
    }

}

export default Graph;