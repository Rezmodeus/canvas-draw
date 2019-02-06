const testDraw = (ctx) => {

// const ctx = canvas.getContext("2d");

// function creates a 3D point (vertex)
	function vertex(x, y, z) {
		return {x, y, z}
	};
// an array of vertices
	const vertices = []; // an array of vertices

// create the 8 vertices that make up a box
	const boxSize = 20; // size of the box
	const hs = boxSize / 2; // half size shorthand for easier typing

	vertices.push(vertex(-hs, -hs, -hs)); // lower top left  index 0
	vertices.push(vertex(hs, -hs, -hs)); // lower top right
	vertices.push(vertex(hs, hs, -hs)); // lower bottom right
	vertices.push(vertex(-hs, hs, -hs)); // lower bottom left
	vertices.push(vertex(-hs, -hs, hs)); // upper top left  index 4
	vertices.push(vertex(hs, -hs, hs)); // upper top right
	vertices.push(vertex(hs, hs, hs)); // upper bottom right
	vertices.push(vertex(-hs, hs, hs)); // upper  bottom left index 7


	const colours = {
		dark: "#040",
		shade: "#360",
		light: "#ad0",
		bright: "#ee0",
	};

	function createPoly(indexes, colour) {
		return {
			indexes,
			colour
		}
	}

	const polygons = [];

	polygons.push(createPoly([1, 2, 6, 5], colours.shade)); // right face
	polygons.push(createPoly([2, 3, 7, 6], colours.light)); // front face
	polygons.push(createPoly([4, 5, 6, 7], colours.bright)); // top face


// From here in I use P2,P3 to create 2D and 3D points
	const P3 = (x = 0, y = 0, z = 0) => ({x, y, z});
	const P2 = (x = 0, y = 0) => ({x, y});
	const D2R = (ang) => (ang - 90) * (Math.PI / 180);
	const Ang2Vec = (ang, len = 1) => P2(Math.cos(D2R(ang)) * len, Math.sin(D2R(ang)) * len);
	const projTypes = {
		PixelBimetric: {
			xAxis: P2(1, 0.5),
			yAxis: P2(-1, 0.5),
			zAxis: P2(0, -1),
			depth: P3(0.5, 0.5, 1), // projections have z as depth
		},
		PixelTrimetric: {
			xAxis: P2(1, 0.5),
			yAxis: P2(-0.5, 1),
			zAxis: P2(0, -1),
			depth: P3(0.5, 1, 1),
		},
		Isometric: {
			xAxis: Ang2Vec(120),
			yAxis: Ang2Vec(-120),
			zAxis: Ang2Vec(0),
		},
		Bimetric: {
			xAxis: Ang2Vec(116.57),
			yAxis: Ang2Vec(-116.57),
			zAxis: Ang2Vec(0),
		},
		Trimetric: {
			xAxis: Ang2Vec(126.87, 2 / 3),
			yAxis: Ang2Vec(-104.04),
			zAxis: Ang2Vec(0),
		},
		Military: {
			xAxis: Ang2Vec(135),
			yAxis: Ang2Vec(-135),
			zAxis: Ang2Vec(0),
		},
		Cavalier: {
			xAxis: Ang2Vec(135),
			yAxis: Ang2Vec(-90),
			zAxis: Ang2Vec(0),
		},
		TopDown: {
			xAxis: Ang2Vec(180),
			yAxis: Ang2Vec(-90),
			zAxis: Ang2Vec(0),
		}
	};

	const axoProjMat = {
		xAxis: P2(1, 0.5),
		yAxis: P2(-1, 0.5),
		zAxis: P2(0, -1),
		depth: P3(0.5, 0.5, 1), // projections have z as depth
		origin: P2(150, 65), // (0,0) default 2D point
		setProjection(name) {
			if (projTypes[name]) {
				Object.keys(projTypes[name]).forEach(key => {
					this[key] = projTypes[name][key];
				});
				if (!projTypes[name].depth) {
					this.depth = P3(
						this.xAxis.y,
						this.yAxis.y,
						-this.zAxis.y
					);
				}
			}
		},
		project(p, retP = P3()) {
			retP.x = p.x * this.xAxis.x + p.y * this.yAxis.x + p.z * this.zAxis.x + this.origin.x;
			retP.y = p.x * this.xAxis.y + p.y * this.yAxis.y + p.z * this.zAxis.y + this.origin.y;
			retP.z = p.x * this.depth.x + p.y * this.depth.y + p.z * this.depth.z;
			return retP;
		}
	};
	axoProjMat.setProjection("Isometric");

	let x, y, z;
	for (z = 0; z < 4; z++) {
		const hz = z / 2;
		for (y = hz; y < 4 - hz; y++) {
			for (x = hz; x < 4 - hz; x++) {
				// move the box
				const translated = vertices.map(vert => {
					return P3(
						vert.x + x * boxSize,
						vert.y + y * boxSize,
						vert.z + z * boxSize,
					);
				});

				// create a new array of 2D projected verts
				const projVerts = translated.map(vert => axoProjMat.project(vert));
				// and render
				polygons.forEach(poly => {
					ctx.fillStyle = poly.colour;
					ctx.strokeStyle = poly.colour;
					ctx.lineWidth = 1;
					ctx.beginPath();
					poly.indexes.forEach(index => ctx.lineTo(projVerts[index].x, projVerts[index].y));
					ctx.stroke();
					ctx.fill();

				});
			}
		}
	}
};

export default {
	testDraw
}
