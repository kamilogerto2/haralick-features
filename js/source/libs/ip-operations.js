/**
 * Created by Kamil on 2016-09-19.
 */
'use strict';
var jsfeat = require('jsfeat');

class ImageProcessingOperations {
	static maximum(image) {
		let max = 0;
		for (var i = 0; i < image.length; i++) {
			image[i] > max ? max = image[i] : max;
		}
		return max;
	}

	static threshold(image, threshold, fullRange, invert) {
		for (var i = 0; i < image.length; i++) {
			if(invert) {
				if (image[i] < threshold) {
					image[i] = fullRange ? 255 : image[i];
				} else {
					image[i] = 0;
				}
			} else {
				if (image[i] > threshold) {
					image[i] = fullRange ? 255 : image[i];
				} else {
					image[i] = 0;
				}
			}

		}
		return image;
	}


//only for size 3 at this moment
	static filterBy(image, width, height, filterMask, size, checkSum) {
		var newImage = [], filterSum = 0, i;
		for (i = 0; i < filterMask.length; i++) {
			filterSum += filterMask[i];
		}
		for (i = 0; i < image.length; i++) {
			if (i < (width * height - width) && i > width - 1 && i % width != Math.floor(size / 2) - 1 && i % width != width - Math.floor(size / 2)) {
				newImage[i] = filterMask[0] * image[i - width - 1] + filterMask[1] * image[i - width] + filterMask[2] * image[i - width + 1];
				newImage[i] += filterMask[3] * image[i - 1] + filterMask[4] * image[i] + filterMask[5] * image[i + 1];
				newImage[i] += filterMask[6] * image[i + width - 1] + filterMask[7] * image[i + width] + filterMask[8] * image[i + width + 1];
				if(checkSum) {
					newImage[i] = newImage[i] > 0 ? newImage[i] / filterSum :0;
				} else {
					newImage[i] = newImage[i] > 0 ? newImage[i] :0;
				}

				//console.log(newImage[i] + ' ' + filterSum);
				/*newImage[i] =  newImage[i] / filterSum;*/
			} else {
				newImage[i] = image[i];
			}
		}

		return newImage;
	}

	static detectCannyEdges(image, height, width) {
	var data_type = jsfeat.U8_t | jsfeat.C1_t;
	var my_matrix = new jsfeat.matrix_t(height, width, data_type, undefined);
	var my_matrix2 = new jsfeat.matrix_t(height, width, data_type, undefined);
	my_matrix.data = image;
	//jsfeat.imgproc.sobel_derivatives(my_matrix, my_matrix2);
	jsfeat.imgproc.canny(my_matrix, my_matrix2, 50, 255);
	return my_matrix2.data;
}
}

module.exports = ImageProcessingOperations;