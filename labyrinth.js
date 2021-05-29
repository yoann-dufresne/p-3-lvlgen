
let legends_data = [
	{name: "none", color: "white"},
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
		this.intern_walls = [...Array(24)].map(()=>false);
		this.extern_walls = [...Array(16)].map(()=>false);
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
}
