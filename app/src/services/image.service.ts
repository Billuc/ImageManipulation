import { ImageManip } from "@model/image.model";

export default class ImageService {
    public static upload(image: Blob | string): Promise<ImageManip> {
        if (image instanceof Blob) {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();

                fileReader.onload = (e) => resolve(new ImageManip(e.target.result));
                fileReader.onerror = (e) => reject();

                fileReader.readAsDataURL(image);
            });
        }
        else {
            return new Promise((resolve, reject) => {
                fetch(image)
                    .then(r => r.blob())
                    .then(blob => {
                        const fileReader = new FileReader();
        
                        fileReader.onload = (e) => resolve(new ImageManip(e.target.result));
                        fileReader.onerror = (e) => reject();
        
                        fileReader.readAsDataURL(blob);
                    })
            })
        }
    }
}