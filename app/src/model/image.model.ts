export class ImageManip {
    private _imageData: string;
    private _pixels: Uint8ClampedArray;
    
    private converting: Promise<void>;
    private fakeCanvas = document.createElement("canvas");
    private fakeImg = document.createElement("img");
    private context = this.fakeCanvas.getContext("2d");

    constructor(data: string)   {
        this._imageData = data;
        this.convertToPixels();
    }

    // Getters / setters

    get imageData() {
        return this._imageData;
    }

    set imageData(data: string) {
        this._imageData = data;
        this.convertToPixels();
    }

    get width() {
        return this.fakeImg.width;
    }

    get height() {
        return this.fakeImg.height;
    }

    // Public methods

    public async getPixels() {
        await this.converting;
        return this._pixels;
    }

    // Private methods

    private convertToPixels() {
        this.converting = new Promise((res, rej) => {
            this.fakeImg.addEventListener("load", _ => { this.setPixels(); res(); });
            this.fakeImg.addEventListener("error", _ => rej());
            this.fakeImg.src = this._imageData;
        });
    }

    private setPixels() {
        this.fakeCanvas.width = this.fakeImg.width;
        this.fakeCanvas.height = this.fakeImg.height;
        this.context.drawImage(this.fakeImg, 0, 0);
        this._pixels = this.context.getImageData(0, 0, this.fakeCanvas.width, this.fakeCanvas.height).data;
    }
}