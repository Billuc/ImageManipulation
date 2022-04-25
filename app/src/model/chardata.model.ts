import type { Color } from "./color.model";

export class CharData {
    width: number;
    height: number;
    data: string[][];
    colors: Color[][];
    
    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.data = Array<string[]>(h);
        this.colors = Array<Color[]>(h);
    }
}