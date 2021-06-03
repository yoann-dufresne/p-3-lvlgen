

let create_face = function() {
	// Create container
	let div = document.createElement("div");
	div.classList.add("face");
	// div.style.border = "solid black 1px";
	div.style.padding = "10px";
	div.style.display = "inline-block";
	div.style["min-height"] = "200px";
	div.style["min-width"] = "200px";

	// Create line paterns
	let horizontal_line = '<tr><td class="inter_square">';
	let vertical_line = '<tr><td class="vertical_wall">';
	for (let i=0 ; i<4 ; i++) {
		horizontal_line += '<td class="horizontal_wall"><td class="inter_square">';
		vertical_line += '<td class="tile"><td class="vertical_wall">';
	}
	horizontal_line += "</td>";
	vertical_line += "</td>";

	// Create full grid
	let grid = "<table>" + horizontal_line;
	for (let i=0 ; i<4 ; i++)
		grid += vertical_line + horizontal_line;
	grid += "</table>";

	div.innerHTML = grid;

	return div;
};


let create_cube = function() {
	let div = document.createElement("div");
	div.style.display = "inline-block";

	div.innerHTML = '<table>\
		<tr><td class="face_includer"></td><td class="face_includer" id="cell_5"></td><td class="face_includer"></td><td class="face_includer"></td></tr>\
		<tr><td class="face_includer" id="cell_3"></td><td class="face_includer" id="cell_4"></td><td class="face_includer" id="cell_2"></td><td class="face_includer" id="cell_1"></td></tr>\
		<tr><td class="face_includer"></td><td class="face_includer"></td><td class="face_includer" id="cell_0"></td><td class="face_includer"></td></tr>\
	</table>'
	let cells = div.querySelectorAll("td");

	// Add faces
	let faces = [... new Array(6)].map(create_face);
	for (let i=0 ; i<6 ; i++) {
		let cell = div.querySelector("#cell_" + i);
		cell.appendChild(faces[i]);
	}

	return div;
}


let main_cube = function() {
	let lvl = document.querySelector("#lvl");

	let cube = create_cube();
	lvl.appendChild(cube);
};

// main_cube();
