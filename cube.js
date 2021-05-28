

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


let main_cube = function() {
	let lvl = document.querySelector("#lvl");

	let face = create_face();
	lvl.appendChild(face);
};

main_cube();
