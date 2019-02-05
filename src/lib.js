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

	const intersect = ([px, py, pz]) => {
		const dx = px - x;
		const dy = py - y;
		const dz = pz - z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz) < radius;
	};
	const getColor = ([px, py, pz]) => {
		const r = (px*4) & 255;
		const g = (py*4) & 255;
		const b = (pz*4) & 255;
		const a = 255;
		return [r, g, b, a];

	};
	return {
		intersect,
		getColor
	};
};
const floor = (point, dimensions, texture) => {
	const {zPos} = dimensions;

	const intersect = ([px, py, pz]) => {
		return pz<=zPos;
	};
	const getColor = ([px, py, pz]) => {
		const f = ((Math.floor(px/10)+Math.floor(py/10))%2)*255;
		const a = 255;
		return [f, f, f, a];

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


const render = (scene, rayVector,imageData,w=400) => {
	const {xSize, ySize, zSize} = scene;
	const yMax = ySize + zSize;
	for (let y = 0; y < yMax; y++) {
		for (let x = xSize; x > -xSize; x--) {
			for (let z = zSize; z > 0; z--) {
				const intesectedObj = scene.objects.find(obj => obj.intersect([x, y, z])) || null;
				const nx = 50+(x+y);
				const ny = 50+(y-x-z);
				const pixelIndex = (ny * w + nx) * 4;
				// console.log(nx, ny, color,pixelIndex );
				if (intesectedObj) {
					const color = intesectedObj.getColor([x, y, z]);

					imageData[pixelIndex] = color[0];
					imageData[pixelIndex+1] = color[1];
					imageData[pixelIndex+2] = color[2];
					imageData[pixelIndex+3] = color[3];
				} else {
					// plot empty
					// imageData[pixelIndex] = 255;
					// imageData[pixelIndex+1] = 255;
					// imageData[pixelIndex+2] = 255;
					// imageData[pixelIndex+3] = 255;
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

};
const test = (imageData) => {

// scene
//
	const scene = {
		xSize: 20,
		ySize: 20,
		zSize: 20,
		objects: []
	};


	const sp = sphere([10, 10, 10], {radius: 5}, null);
	const fl = floor([],{zPos:2},null);
	scene.objects.push(sp);
	scene.objects.push(fl);
	render(scene, null,imageData.data);
};


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
	objToPoints,
	test
}