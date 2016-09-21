/**
 * Created by Kamil on 2016-09-21.
 */

var jsfeat = require('jsfeat');
//var image = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 5]);
var image = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 5];

var data_type = jsfeat.U8_t | jsfeat.C1_t;
var my_matrix = new jsfeat.matrix_t(5, 5, data_type, data_buffer = undefined);
var my_matrix2 = new jsfeat.matrix_t(5, 5, data_type, data_buffer = undefined);
//setData(image, my_matrix);
//my_matrix.buffer.u8 = image;
my_matrix.data = image;

jsfeat.imgproc.gaussian_blur(my_matrix, my_matrix2, 3, sigma = 0);
console.log(my_matrix);
console.log(my_matrix2);

function setData(image, matrix) {
	for (var i = 0; i < image.length; i++) {
		matrix.buffer.data_t.u8[i] = image [i];
	}
}