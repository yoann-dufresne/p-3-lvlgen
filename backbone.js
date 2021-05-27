
let def_sizes = function() {
	// Get usable sizes
	let screen_w = window.innerWidth - 10;
	let screen_h = window.innerHeight - 20;

	// Set page size
	let body = document.querySelector("body");
	body.style.width = "" + screen_w + "px";
	body.style.height = "" + screen_h + "px";
	let body_border = 1;
	body.style.border = "solid blue " + body_border + "px";


	// Set left sizes
	let left = document.querySelector("#left_bar");
	let left_width = 300;
	let left_height = screen_h - 2 * body_border;
	left.style.width = "" + left_width + "px";
	left.style.height = "" + left_height + "px";
	let left_border = 1;
	left.style["border-right"] = "solid black " + left_border + "px";

	// Set lvl design sizes
	let lvl = document.querySelector("#lvl");
	let lvl_border = 0;
	//              1433           1             300          1                 3
	let lvl_width = screen_w - 2 * body_border - left_width - left_border - 2 * lvl_border;
	let lvl_height = screen_h - 2 * body_border - 2 * lvl_border;
	lvl.style.width = "" + lvl_width + "px";
	lvl.style.height = "" + lvl_height + "px";
	// lvl.style.height = "100%";
	lvl.style.border = "solid red " + lvl_border + "px";
};



let backbone_main = function() {
	def_sizes();
}
backbone_main();
