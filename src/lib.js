import * as math from 'mathjs'
// x = x,-y  upp right
// y = x,y  down left
// z = y up


// 90 degree surfaces only use case


// distance fields
// use the closest object. min(all distances)
// min = union
// max = intersection

const planeDirections = {
	'SIDE': 'side',
	'FRONT': 'front',
	'TOP': 'top',
}

const a = math.dot([2, 4, 1], [2, 2, 3]);
// math.multiply([2, 4, 1], [2, 2, 3])

// TODO: direction as a vector


const sphere = (point, dimensions, texture) => {
	const [x, y, z] = point;
	const {radius} = dimensions;

	const intersect = (p) => {
		const dx = p.x - x;
		const dy = p.y - y;
		const dz = p.z - z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz) < radius;
	};
	const getColor = (p) => {
		const r = p.x & 255;
		const g = p.y & 255;
		const b = p.z & 255;
		const a = 255;
		return [r, g, b, a];

	};
	return {
		intersect,
		getColor
	};
};

const plane = (normal, point, dimensions, texture) => {
	const [x, y, z] = point;
	const {width, height} = dimensions;

	const intersect = (p) => {
		//float dist = dotProduct(p.normal, (vectorSubtract(point, p.point)));
	};
	return {intersect};
};

// scene
//
const scene = {
	xSize: 50,
	ySize: 50,
	zSize: 50,
	objects: []
};

scene.objects.push(sphere([15, 15, 15], {radius: 5}, null));


const render = (scene, rayVector) => {
		const {xSize, ySize, zSize} = scene;
		const yMax = ySize + zSize;

		for (let y = 0; y++; y < yMax) {
			for (let x = xSize; x--; x > -xSize) {
				for (let z = zSize; z--; z > 0) {
					const intesectedObj = scene.objects.find(obj => obj.intersect([x, y, z])) || null;
					if (intesectedObj) {
						const color = intesectedObj.getColor([x, y, z]);
					}

				}
			}
		}


		// loop with y from 0 to yMax
		//   loop x from xSize to -zSize
		//     loop z from zSize to 0
		//       intersectedObject = scene.objects.find(o=>o.intersect(x,y,z)) || null
		//       if intersectedObject
		//         store intersectedObject.getColor([x,y,z])
		//         break

	}
;


// define a surface


const isoSort = (p0, p1) => {
	// same z
	if (p0[2] === p1[2]) {
		// same y
		if (p0[1] === p1[1]) {
			// use x
			return p0[0] - p1[0];
		} else {
			// use y
			return p0[1] - p1[1];
		}
	} else {
		// use z
		return p0[2] - p1[2];
	}
};

//  x_y_z:[r,g,b,a,option]

const objToPoints = (obj) => {
	return Object.keys(obj).map(key => {
		const item = obj[key];//[r,g,b,a,option]
		return key.split('_').concat(item);
	});
};

const pointsToPerspective = (xOffset, yOffset, zOffset, points) => {
};

const drawTop = (position, dimensions, texture) => {
};
const drawFront = (position, dimensions, texture) => {
};
const drawSide = (position, dimensions, texture) => {
};


const getBox = (position, dimensions, texture) => {
	const {x, y, z} = position;
	const {xSize, ySize, zSize} = dimensions;
	const {texWidth, texHeight, texData} = texture;
	let obj = {};

	for (let px = x; px < x + xSize; px++) {
		for (let py = y; py < y + ySize; py++) {
			for (let pz = z; pz < z + zSize; py++) {
				const key = px + '_' + py + '_' + pz;
				obj[key] = [];
			}
		}
	}
	return obj;
};

const addToScene = (item, func = 'REPLACE', scene) => {
};

const subtractShape = () => {
};

export default {
	isoSort,
	objToPoints
}