/**
 * Created by Kamil on 2016-09-19.
 */


class ImageProcessingOperations {
	static maximum (image) {
		let max = 0;
		for (var i = 0; i < image.length; i++) {
			image[i] > max ? max = image[i] : max;
		}
		return max;
	}

	static threshold(image, threshold) {
		for(var i = 0; i < image.length; i++ ) {
			if(i % 4 != 3) {
				if (image[i] > threshold) {
					image[i] = 1;
				}
			} else {
				image[i] = 1;
			}
		}
	}
}

module.exports = ImageProcessingOperations;