export class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _h: number;
    private _s: number;
    private _v: number;
    private _a: number;

    constructor(mode: 'rgb' | 'hsv' = 'rgb', ...coords: number[]) {
        if (mode == 'rgb') {
            this._r = coords[0] ?? 0;
            this._g = coords[1] ?? 0;
            this._b = coords[2] ?? 0;
            this._a = coords[3] ?? 1;
            this.calcHSV();
        }
        else if (mode == 'hsv') {
            this._h = coords[0] ?? 0;
            this._s = coords[1] ?? 0;
            this._v = coords[2] ?? 0;
            this._a = coords[3] ?? 1;
            this.calcRGB();
        }
    }

    get r(): number { return this._r; }
    get g(): number { return this._g; }
    get b(): number { return this._b; }

    set r(value: number) { this._r = value; this.calcHSV(); }
    set g(value: number) { this._g = value; this.calcHSV(); }
    set b(value: number) { this._b = value; this.calcHSV(); }

    get h(): number { return this._h; }
    get s(): number { return this._s; }
    get v(): number { return this._v; }

    set h(value: number) { this._h = value; this.calcRGB(); }
    set s(value: number) { this._s = value; this.calcRGB(); }
    set v(value: number) { this._v = value; this.calcRGB(); }

    get a(): number { return this._a; }
    set a(value: number) { this._a = value; }

    public toHex(): string {
        return "#" + 
            Math.floor(this._r * 255).toString(16) + 
            Math.floor(this._g * 255).toString(16) + 
            Math.floor(this._b * 255).toString(16) + 
            Math.floor(this._a * 255).toString(16);
    }

    // https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
    private calcHSV(): void {
        this._v = Math.max(this._r, this._g, this._b);
        const min = Math.min(this._r, this._g, this._b);
        const c = this._v - min;

        if (c == 0) this._h = 0;
        else if (this._v == this._r) this._h = 60 * (0 + (this._g - this._b) / c);
        else if (this._v == this._g) this._h = 60 * (2 + (this._b - this._r) / c);
        else if (this._v == this._b) this._h = 60 * (4 + (this._r - this._g) / c);

        if (this._v == 0) this._s = 0;
        else this._s = c / this._v;
    }

    // https://en.wikipedia.org/wiki/HSL_and_HSV#To_RGB
    private calcRGB(): void {
        const c = this._v * this._s;
        const hPrime = this._h / 60;
        const x = c * (1 - Math.abs(hPrime % 2 - 1));

        let r1 = 0, g1 = 0, b1 = 0;
        if (0 <= hPrime && hPrime < 1) {
            r1 = c;
            g1 = x;
        } else if (1 <= hPrime && hPrime < 2) {
            r1 = x;
            g1 = c;
        } else if (2 <= hPrime && hPrime < 3) {
            g1 = c;
            b1 = x;
        } else if (3 <= hPrime && hPrime < 4) {
            g1 = x;
            b1 = c;
        } else if (4 <= hPrime && hPrime < 5) {
            r1 = x;
            b1 = c;
        } else {
            r1 = c;
            b1 = x;
        }

        const m = this._v - c;
        this._r = r1 + m;
        this._g = g1 + m;
        this._b = b1 + m;
    }
}