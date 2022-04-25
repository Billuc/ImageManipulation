import { CharData } from "./chardata.model";
import { Color } from "./color.model";
import type { ImageManip } from "./image.model";
import { Mode } from "./mode.model";

export class TransformHelper {
    private readonly ASCII_DENSITY = 'Ñ@#W$9876543210?!abc;:+=-,._ ';

    private readonly EDGE_DETECTION = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
    private readonly BLUR = [[1 / 16, 2 / 16, 1 / 16], [2 / 16, 4 / 16, 2 / 16], [1 / 16, 2 / 16, 1 / 16]];
    private readonly SHARPEN = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];

    private image: ImageManip;
    private pixelationSize: number = 15;

    constructor() { }

    // Public Methods

    setImage(image: ImageManip) {
        this.image = image;
    }

    setPixelationSize(pixels: number) {
        this.pixelationSize = pixels;
    }

    async getImage(mode: Mode): Promise<CharData | ImageData> {
        if (!this.image) throw new Error();

        const pixels = await this.image.getPixels();

        if (mode == Mode.Ascii) return this.toAscii(pixels);

        const finalPixels = this.transformPixels(pixels, mode);

        const width = this.image.width;
        const height = this.image.height;
        return new ImageData(finalPixels, width, height);
    }

    // Private Methods

    private transformPixels(pixels: Uint8ClampedArray, mode: Mode): Uint8ClampedArray {
        switch (mode) {
            case Mode.Pixellized:
                return this.pixelate(pixels);
            case Mode.Border:
                return this.applyFilter(pixels, this.EDGE_DETECTION);
            case Mode.Blur:
                return this.applyFilter(pixels, this.BLUR);
            case Mode.Sharpen:
                return this.applyFilter(pixels, this.SHARPEN);
            default:
                return pixels;
        }
    }

    private pixelate(pixels: Uint8ClampedArray): Uint8ClampedArray {
        let result: number[] = [];
        let pixelColors: number[][][]; // pixelColors is an array of colors. Dimensions : (pixelationSize + 1) * (nbOfPixelsY + 1) * 4

        const pixelSize = Math.floor(this.image.width / this.pixelationSize);
        const nbOfPixelsY = Math.floor(this.image.height / pixelSize);

        pixelColors = Array<number[][]>(nbOfPixelsY + 1); // Adding +1 for remainders

        // Loop pixels to fill pixelColors
        for (let j = 0; j < this.image.height; j++) {
            for (let i = 0; i < this.image.width; i++) {
                const pixel = this.positionToPixel(i, j);
                const pixelX = Math.floor(i / pixelSize);
                const pixelY = Math.floor(j / pixelSize);

                if (!pixelColors[pixelY]) pixelColors[pixelY] = Array<number[]>(this.pixelationSize + 1);
                if (!pixelColors[pixelY][pixelX]) pixelColors[pixelY][pixelX] = [0, 0, 0, 0];

                pixelColors[pixelY][pixelX][0] += pixels[pixel[0]];
                pixelColors[pixelY][pixelX][1] += pixels[pixel[1]];
                pixelColors[pixelY][pixelX][2] += pixels[pixel[2]];
                pixelColors[pixelY][pixelX][3] += pixels[pixel[3]];
            }
        }

        // Loop pixels to fill result
        for (let j = 0; j < this.image.height; j++) {
            for (let i = 0; i < this.image.width; i++) {
                const pixelX = Math.floor(i / pixelSize);
                const pixelY = Math.floor(j / pixelSize);

                result.push(this.clamp(pixelColors[pixelY][pixelX][0] / (pixelSize * pixelSize), 0, 255));
                result.push(this.clamp(pixelColors[pixelY][pixelX][1] / (pixelSize * pixelSize), 0, 255));
                result.push(this.clamp(pixelColors[pixelY][pixelX][2] / (pixelSize * pixelSize), 0, 255));
                result.push(this.clamp(pixelColors[pixelY][pixelX][3] / (pixelSize * pixelSize), 0, 255));
            }
        }

        return new Uint8ClampedArray(result);
    }

    private toAscii(pixels: Uint8ClampedArray): CharData {
        const pixelSize = Math.floor(this.image.width / this.pixelationSize);
        const nbOfPixelsY = Math.floor(this.image.height / pixelSize);

        var chardata = new CharData(this.pixelationSize, nbOfPixelsY);
        
        let pixelColors: number[][][]; // pixelColors is an array of colors. Dimensions : pixelationSize * nbOfPixelsY * 4
        pixelColors = Array<number[][]>(nbOfPixelsY + 1);  // Adding +1 for remainders

        // Loop pixels to fill pixelColors
        for (let j = 0; j < this.image.height; j++) {
            for (let i = 0; i < this.image.width; i++) {
                const pixel = this.positionToPixel(i, j);
                const pixelX = Math.floor(i / pixelSize);
                const pixelY = Math.floor(j / pixelSize);

                if (!pixelColors[pixelY]) pixelColors[pixelY] = Array<number[]>(this.pixelationSize + 1);
                if (!pixelColors[pixelY][pixelX]) pixelColors[pixelY][pixelX] = [0, 0, 0, 0];

                pixelColors[pixelY][pixelX][0] += pixels[pixel[0]];
                pixelColors[pixelY][pixelX][1] += pixels[pixel[1]];
                pixelColors[pixelY][pixelX][2] += pixels[pixel[2]];
                pixelColors[pixelY][pixelX][3] += pixels[pixel[3]];
            }
        }
        
        for (let pixelJ = 0; pixelJ < chardata.height; pixelJ++) {
            for (let pixelI = 0; pixelI < chardata.width; pixelI++) {
                const pixel = pixelColors[pixelJ][pixelI];
                const scaleDown = 1 / (pixelSize * pixelSize * 255);

                if (!chardata.data[pixelJ]) chardata.data[pixelJ] = Array<string>(this.pixelationSize);
                if (!chardata.colors[pixelJ]) chardata.colors[pixelJ] = Array<Color>(this.pixelationSize);

                const color = new Color(
                    "rgb",
                    this.clamp(pixel[0] * scaleDown, 0, 1),
                    this.clamp(pixel[1] * scaleDown, 0, 1),
                    this.clamp(pixel[2] * scaleDown, 0, 1),
                    this.clamp(pixel[3] * scaleDown, 0, 1)
                );

                const colorDensity = color.v * color.a;
                chardata.data[pixelJ][pixelI] = this.densityToChar(colorDensity);

                color.v = 1;
                color.a = 1;

                chardata.colors[pixelJ][pixelI] = color;
            }
        }

        return chardata;
    }

    // Inspired by https://github.com/jace21/Image-Filters/blob/master/filters.java
    private applyFilter(pixels: Uint8ClampedArray, filter: number[][]): Uint8ClampedArray {
        let result: number[] = [];

        const filterSum = filter.reduce((sum, row) => sum + row.reduce((rowSum, col) => rowSum + col, 0), 0);

        // Loop pixels
        for (let j = 0; j < this.image.height; j++) {
            for (let i = 0; i < this.image.width; i++) {
                let r = 0;
                let g = 0;
                let b = 0;
                let a = (filterSum == 0) ? 255 : 0;

                // Loop filter
                for (let filtJ = 0; filtJ < filter.length; filtJ++) {
                    for (let filtI = 0; filtI < filter[filtJ].length; filtI++) {
                        const x = (i - Math.floor(filter[filtJ].length / 2) + filtI + this.image.width) % this.image.width;
                        const y = (j - Math.floor(filter.length / 2) + filtJ + this.image.height) % this.image.height;

                        const pixel = this.positionToPixel(x, y);

                        r += pixels[pixel[0]] * filter[filtJ][filtI];
                        g += pixels[pixel[1]] * filter[filtJ][filtI];
                        b += pixels[pixel[2]] * filter[filtJ][filtI];
                        a += pixels[pixel[3]] * filter[filtJ][filtI];
                    }
                }

                result.push(this.clamp(r, 0, 255));
                result.push(this.clamp(g, 0, 255));
                result.push(this.clamp(b, 0, 255));
                result.push(this.clamp(a, 0, 255));
            }
        }

        return new Uint8ClampedArray(result);
    }

    private positionToPixel(x: number, y: number): number[] {
        const start = (this.image.width * y + x) * 4; // multiplied by 4 because we get 4 values for each pixel (r, g, b, a)
        return [start, start + 1, start + 2, start + 3];
    }

    private densityToChar(density: number): string {
        const index = this.clamp(28 - Math.floor(density * 29), 0, 28); // density / 1 / 29 (29 = number of chars)
        return this.ASCII_DENSITY[index];
    }

    private clamp(value: number, min: number, max: number) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }
}