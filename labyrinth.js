
let legends_data = [
	{name: "none", color: "white"},
	{name: "hero", color: "lightgrey"},
	{name: "win", color: "green"},
	{name: "enemy", color: "red"}
];


class Labyrinth {
	constructor(div) {
		// dom objects
		this.div = div;
		this.display = create_cube();

		// Legend interaction
		this.current_value = legends_data[0];
		this.add_legend();

		// Cube values
		this.tiles = [...Array(6)].map(()=>[...Array(4)].map(()=>[...Array(4)].map(()=>"none")));
		this.add_tile_triggers();
		this.intern_walls = [...Array(6)].map(()=>[...Array(24)].map(()=>false));
		this.extern_walls = [...Array(6)].map(()=>[...Array(16)].map(()=>false));
		this.add_walls_triggers();
	}

	get_binary() {
		let bin_array = ['L'.charCodeAt(0), 0];

		// Hero position
		let hero_coords = [-1, -1, -1];
		for (let f=0 ; f<6 ; f++)
			for (let r=0 ; r<4 ; r++)
				for (let c=0 ; c<4 ; c++)
					if (this.tiles[f][r][c] == "hero")
						hero_coords = [f, r, c];
		bin_array = bin_array.concat(compact_coords(...hero_coords));

		// walls
		let faces_used = 0;
		for (let f=0 ; f<6 ; f++) {
			let bin_face = this.get_face_binary(f, face_rotations[f]);
			if (bin_face != null) {
				faces_used |= 1<<f;
				bin_array = bin_array.concat(bin_face);
			}
		}
		bin_array[1] = faces_used;

		let nb_objects_idx = bin_array.length;
		bin_array.push(0);
		for (let f=0 ; f<6 ; f++) {
			let obj_array = this.get_objects(f, face_rotations[f]);
			bin_array[nb_objects_idx] += obj_array.pop();
			bin_array = bin_array.concat(obj_array);
		}

		return bin_array;
	}

	get_objects(f, rotation) {
		let nb_objects = 0;
		let bin_array = [];

		// Objects
		for (let r=0 ; r<4 ; r++) {
			for (let c=0 ; c<4 ; c++) {
				let rotated = coord_rot(r, c, rotation);
				let r_rot = rotated[0];
				let c_rot = rotated[1];
				let val = this.tiles[f][r][c];

				if (!["hero", "none"].includes(val)) {
					// console.log(rotation, f, r, c, rotated);
					nb_objects += 1;
					bin_array = bin_array.concat(
						[val.charCodeAt(0), compact_coords(f, r_rot, c_rot)]
					);
				}
			}
		}
		
		bin_array.push(nb_objects);

		return bin_array;
	}

	intern_rot(walls_int, rotation) {
		if (rotation == 0) {
			// Base value
			return walls_int;
		} else {
			let rotated_walls = 0;
			// horizontals -> verticals
			rotated_walls = ((walls_int & 0b111) << 21) | (((walls_int >> 3) & 0b111) << 18);
			rotated_walls |= (((walls_int >> 6) & 0b111) << 15) | (((walls_int >> 9) & 0b111) << 12);
			// verticals -> horizontals
			walls_int = reverse_bits(walls_int, 3);
			rotated_walls |= ((walls_int & 0b111) << 9) | (((walls_int >> 3) & 0b111) << 6);
			rotated_walls |= (((walls_int >> 6) & 0b111) << 3) | ((walls_int >> 9) & 0b111);

			// Recursive call
			return this.intern_rot(rotated_walls, rotation-1);
		}
	}

	extern_rot(walls_int, rotation) {
		if (rotation == 0) {
			return walls_int;
		} else {
			let rotated_walls = (walls_int << 4) & 0xFFFF;
			rotated_walls |= (walls_int >> 12) & 0xF;

			return this.extern_rot(rotated_walls, rotation-1);
		}
	}

	get_face_binary(face, rotation) {
		let bin_array = [];
		let empty = true;

		// Internal walls
		let int = 0;
		for (let i=0 ; i<24 ; i++) {
			int |= (this.intern_walls[face][i] ? 1 : 0) << (23 - i);
		}

		int = this.intern_rot(int, rotation);
		bin_array = bin_array.concat([int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF])
		if (int != 0)
			empty = false;

		// External walls
		let ext = 0;
		for (let i=0 ; i<16 ; i++) {
			ext |= (this.extern_walls[face][i] ? 1 : 0) << (15 - i);
		}
		ext = this.extern_rot(ext, rotation);
		bin_array = bin_array.concat([ext >> 8 & 0xFF, ext & 0xFF])
		if (ext != 0)
			empty = false;

		// Return
		if (empty)
			return null;
		else
			return bin_array;
	}

	add_legend() {
		let legends_div = this.display.querySelectorAll(".face_includer")[8];
		for (let ld of legends_data) {
			// High level legend div
			let div_legend = document.createElement("div");
			div_legend.classList.add("laby_legend");
			div_legend.name = ld.name;
			legends_div.appendChild(div_legend);

			// Color
			let color = document.createElement("span");
			color.style.display = "inline-block";
			color.style["background-color"] = ld.color;
			color.style.border = "solid black 1px";
			color.style["min-width"] = "28px";
			color.style["min-height"] = "28px";
			div_legend.appendChild(color);

			// Name
			let name = document.createElement("span");
			name.style.display = "inline-block";
			name.style["padding-left"] = "10px";
			name.innerHTML = "<p>" + ld.name + "</p>";
			div_legend.appendChild(name);

			let that = this;
			div_legend.onclick = function() {
				let all_legends = legends_div.querySelectorAll(".laby_legend");
				for (let leg of all_legends)
					leg.style["background-color"] = "white";
				div_legend.style["background-color"] = "DarkSeaGreen";
				that.current_value = {name:div_legend.name, color:div_legend.firstChild.style["background-color"]};
			}
		}
		legends_div.firstChild.onclick();
	}

	add_tile_triggers() {
		let that = this;

		for (let face=0 ; face<6 ; face++) {
			let face_includer = this.display.querySelector("#cell_" + face);
			let tiles = face_includer.querySelectorAll(".tile");
			
			for (let r=0 ; r<4 ; r++) {
				for (let c=0 ; c<4 ; c++) {
					let tile = tiles[r * 4 + c];
					tile.onclick = function() {
						that.tiles[face][r][c] = that.current_value.name;
						tile.style["background-color"] = that.current_value.color;
					}
				}
			}
		}
	}

	add_walls_triggers() {
		let that = this;
		let opposite = {black: "white", white: "black", undefined:"black"};

		for (let face=0 ; face<6 ; face++) {
			let face_includer = this.display.querySelector("#cell_" + face);
			let verticals = face_includer.querySelectorAll(".vertical_wall");
			
			// Vertical walls
			for (let v_idx=0 ; v_idx<verticals.length ; v_idx++) {
				// First column
				if (v_idx % 5 == 0) {
					verticals[v_idx].onclick = function() {
						that.extern_walls[face][Math.floor(v_idx/5)] = !that.extern_walls[face][Math.floor(v_idx/5)];
						if (!["black", "white"].includes(verticals[v_idx].style["background-color"])) 
							verticals[v_idx].style["background-color"] = "black";
						else
							verticals[v_idx].style["background-color"] = opposite[verticals[v_idx].style["background-color"]];
					};
				}
				// Last column
				else if (v_idx % 5 == 4) {
					verticals[v_idx].onclick = function() {
						that.extern_walls[face][11 - Math.floor(v_idx/5)] = !that.extern_walls[face][11 - Math.floor(v_idx/5)];
						if (!["black", "white"].includes(verticals[v_idx].style["background-color"])) 
							verticals[v_idx].style["background-color"] = "black";
						else
							verticals[v_idx].style["background-color"] = opposite[verticals[v_idx].style["background-color"]];
					};
				}
				// Middle columns
				else {
					verticals[v_idx].onclick = function() {
						that.intern_walls[face][Math.floor(v_idx/5) * 3 + (v_idx % 5) - 1] = !that.intern_walls[face][Math.floor(v_idx/5) * 3 + (v_idx % 5) - 1];
						if (!["black", "white"].includes(verticals[v_idx].style["background-color"])) 
							verticals[v_idx].style["background-color"] = "black";
						else
							verticals[v_idx].style["background-color"] = opposite[verticals[v_idx].style["background-color"]];
					};
				}
			}

			// horizontal walls
			let horizontals = face_includer.querySelectorAll(".horizontal_wall");
			// First row
			for (let h_idx=0 ; h_idx<4 ; h_idx++) {
				horizontals[h_idx].onclick = function() {
					that.extern_walls[face][15 - h_idx] = !that.extern_walls[face][15 - h_idx];
					if (!["black", "white"].includes(horizontals[h_idx].style["background-color"])) 
						horizontals[h_idx].style["background-color"] = "black";
					else
						horizontals[h_idx].style["background-color"] = opposite[horizontals[h_idx].style["background-color"]];
				};

			// 3 middle rows
			for (let h_idx=4 ; h_idx<16 ; h_idx++)
				horizontals[h_idx].onclick = function() {
					that.intern_walls[face][12 + (h_idx % 4) * 3 + Math.floor(h_idx / 4) - 1] =
							!that.intern_walls[face][12 + (h_idx % 4) * 3 + Math.floor(h_idx / 4) - 1];
					if (!["black", "white"].includes(horizontals[h_idx].style["background-color"])) 
						horizontals[h_idx].style["background-color"] = "black";
					else
						horizontals[h_idx].style["background-color"] = opposite[horizontals[h_idx].style["background-color"]];
				};

			// Last row
			for (let h_idx=16 ; h_idx<20 ; h_idx++)
				horizontals[h_idx].onclick = function() {
					that.extern_walls[face][4 + h_idx - 16] = !that.extern_walls[face][4 + h_idx - 16];
					if (!["black", "white"].includes(horizontals[h_idx].style["background-color"])) 
						horizontals[h_idx].style["background-color"] = "black";
					else
						horizontals[h_idx].style["background-color"] = opposite[horizontals[h_idx].style["background-color"]];
				};
			}
		}
	}
}
