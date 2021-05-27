
let set_triggers = function() {
	let left = document.querySelector("#left_bar");
	let adder_div = document.querySelector("#lvl_adder");
	let lvl_type = document.querySelector("#lvl_type");
	let btn_adder = document.querySelector("#lvl_add");
	let lvl_list = document.querySelector("#lvl_list");
	let remaining_height = left.clientHeight - adder_div.offsetHeight;
	lvl_list.style.height = "" + remaining_height + "px";

	btn_adder.onclick = function() {
		let elem = document.createElement("div");
		elem.classList.add("lvl_summary");
		elem.style["min-height"] = "50px";
		elem.style.width = "100%";
		lvl_list.appendChild(elem);
	}
};


let main = function() {
	set_triggers();
};

main();

