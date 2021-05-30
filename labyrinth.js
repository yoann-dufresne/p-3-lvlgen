
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

		let hero_coords = [-1, -1, -1];
		for (let f=0 ; f<6 ; f++)
			for (let r=0 ; r<4 ; r++)
				for (let c=0 ; c<4 ; c++)
					if (this.tiles[f][r][c] == "hero")
						hero_coords = [f, r, c];
		bin_array = bin_array.concat(compact_coords(...hero_coords));

		let faces_used = 0;
		let rotations = [0, 1, 3, 2, 3, 1];

		for (let f=0 ; f<6 ; f++) {
			let bin_face = this.get_face_binary(f, rotations[f]);
			if (bin_face != null) {
				faces_used |= 1<<f;
				bin_array = bin_array.concat(bin_face);
			}
		}
		bin_array[1] = faces_used;

		return bin_array;
	}

	get_face_binary(face, rotation) {
		return null;
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
