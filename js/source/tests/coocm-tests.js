/**
 * Created by Kamil on 2016-03-15.
 */
var math = require('mathjs');
var COOCMCalculator = require('../co-oc-matrix');

var y = math.matrix([[1, 1, 2], [3, 2, 2], [1, 1, 1]]);
console.log(y);

/* should be:
| 0  0    0     0    |
| 0  0.5  0.08  0    |
| 0  0.08 0.016 0.08 |
| 0  0    0.08  0    | */
var coocm = new COOCMCalculator(4, 1, 'horizontally');
coocm.calculateCOOCM(y);
///////////passed//////////////


/*change distance for 2
 should be:
 | 0  0    0     0    |
 | 0  0.5  0.25  0    |
 | 0  0.25 0     0    |
 | 0  0    0     0    |*/

coocm.setDistance(2);
coocm.calculateCOOCM(y);
///////////passed//////////////

/*change distance for 3
 should be:
 | 0  0    0     0    |
 | 0  0    0     0    |
 | 0  0    0     0    |
 | 0  0    0     0    |*/

coocm.setDistance(3);
coocm.calculateCOOCM(y);
///////////passed 50%//////////////
/////not see math js - why? ///////

/*change distance for 1
 change orientation for vertically
 should be:
 | 0  0       0        0    |
 | 0  0       0.24     0.16 |
 | 0  0.24    0.16     0    |
 | 0  0.16    0        0    |*/

coocm.setDistance(1);
coocm.setOrientation('vertically');
coocm.calculateCOOCM(y);
///////////passed /////////////////

/*change distance for 2
 change orientation for vertically
 should be:
 | 0  0       0        0    |
 | 0  0,67    0.16     0    |
 | 0  0.16    0        0    |
 | 0  0       0        0    |*/

coocm.setDistance(2);
coocm.setOrientation('vertically');
coocm.calculateCOOCM(y);
///////////passed /////////////////

/*change distance for 1
 change orientation for 45st
 should be:
 | 0  0       0        0    |
 | 0  0       0.25     0.125|
 | 0  0.25    0.25     0    |
 | 0  0.125   0        0    |*/

coocm.setDistance(1);
coocm.setOrientation('45st');
coocm.calculateCOOCM(y);
///////////passed /////////////////

/*change distance for 2
 change orientation for 45st
 should be:
 | 0  0       0        0    |
 | 0  0       0.5      0    |
 | 0  0.5     0        0    |
 | 0  0       0        0    |*/

coocm.setDistance(2);
coocm.setOrientation('45st');
coocm.calculateCOOCM(y);
///////////passed /////////////////

/*change distance for 1
 change orientation for 135st
 should be:
 | 0  0       0        0    |
 | 0  0       0.375    0.125|
 | 0  0.375   0        0    |
 | 0  0.125   0        0    |*/

coocm.setDistance(1);
coocm.setOrientation('135st');
coocm.calculateCOOCM(y);
///////////passed /////////////////

/*change distance for 2
 change orientation for 135st
 should be:
 | 0  0       0        0    |
 | 0  0       0.375    0.125|
 | 0  0.375   0        0    |
 | 0  0.125   0        0    |*/

coocm.setDistance(2);
coocm.setOrientation('135st');
coocm.calculateCOOCM(y);
///////////passed /////////////////