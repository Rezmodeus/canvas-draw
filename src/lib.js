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


export default {
	isoSort,
	objToPoints
}