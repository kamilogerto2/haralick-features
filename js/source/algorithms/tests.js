/**
 * Created by Kamil on 2016-09-19.
 */
var morphologic = require('../libs/morphologic-operations');

var image = [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];

var mo = new morphologic(5, 5, image);
console.log('everything ok');
mo.dilateWithElement();
console.log(mo.data);