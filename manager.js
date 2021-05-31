
// Manually defined
let enigma_classes = [Labyrinth];
let global_enigma_list = [];


let set_options = function() {
	let select = document.querySelector("#lvl_type");

	for (let cls of enigma_classes) {
		// Set opt to select
		let opt = document.createElement("option");
		opt.value = cls.name;
		opt.text = cls.name;
		select.appendChild(opt);
	}
}

let set_add_onclicks = function() {
	// prepare classes dict
	let class_dict = {};
	for (let cls of enigma_classes)
		class_dict[cls.name] = cls;

	// set onclick
	let add_button = document.querySelector("#lvl_add");
	let prev_function = add_button.onclick;
	
	add_button.onclick = () => {
		// Exec the div creation
		prev_function();

		// Get the div created
		let lvl_div = document.querySelector("#lvl_list").lastChild;

		// Create the object linked
		let val = document.querySelector("#lvl_type").value;
		let obj = new class_dict[val](lvl_div);
		global_enigma_list.push(obj);

		// Set div onclick operation
		lvl_div.onclick = function() {
			if (lvl_div.id == "lvl_deleted")
				return;
			// Reset all the backgrounds
			let lvl_divs = document.querySelectorAll(".lvl_summary");
			for (let lvl of lvl_divs)
				lvl.style["background-color"] = "white";
			// turn grey the selected
			lvl_div.style["background-color"] = "lightgrey";
			// replace the display
			let display = document.querySelector("#lvl");
			if (display.childElementCount > 0)
				display.removeChild(display.firstChild);
			display.appendChild(obj.display);
		}

		// Remove main display on delete
		let del_btn = lvl_div.querySelector(".del_lvl");
		// Rm the lvl obj from the level list
		let prev_del_func = del_btn.onclick;
		del_btn.onclick = function(e) {
			// Compute next lvl to select
			var index = Array.prototype.indexOf.call(lvl_div.parentNode.children, lvl_div);
			global_enigma_list.splice(index, 1);
			if (index == lvl_div.parentNode.childElementCount - 1)
				if (index == 0)
					index = -1;
				else
					index -= 1;
			// Delete the div from the list
			let is_selected = lvl_div.style["background-color"] != "white";
			prev_del_func(e);

			// Event propagation
			lvl_div.id = "lvl_deleted";
			if (!is_selected)
				return;

			// Renew the main display selecting another level
			lvl_div.onclick = ()=>{};
			let display = document.querySelector("#lvl");
			if (index == -1) {
				if (display.childElementCount > 0)
					display.removeChild(display.firstChild);
			} else {
				document.querySelector("#lvl_list").children[index].onclick();
			}
		}

		// Up and down buttons
		let up_btn = lvl_div.querySelector(".up_lvl");
		up_btn.onclick = function() {
			var index = Array.prototype.indexOf.call(lvl_div.parentNode.children, lvl_div);

			if (index == 0)
				return;

			// Modification of global list
			let elem = global_enigma_list.splice(index, 1)[0];
			global_enigma_list.splice(index-1, 0, elem);

			// Modification of displayes list
			let lvls = document.querySelector("#lvl_list");
			lvls.removeChild(lvl_div);
			lvls.insertBefore(lvl_div, lvls.children[index-1]);
		};

		let down_btn = lvl_div.querySelector(".down_lvl");
		down_btn.onclick = function() {
			var index = Array.prototype.indexOf.call(lvl_div.parentNode.children, lvl_div);

			if (index == lvl_div.parentNode.childElementCount - 1)
				return;

			// Modification of global list
			let elem = global_enigma_list.splice(index, 1)[0];
			global_enigma_list.splice(index+1, 0, elem);

			// Modification of displayes list
			let lvls = document.querySelector("#lvl_list");
			lvls.removeChild(lvl_div);

			if (index == lvls.childElementCount - 1)
				lvls.appendChild(lvl_div);
			else
				lvls.insertBefore(lvl_div, lvls.children[index+1]);
		};

		lvl_div.onclick();
	}
}


let set_save_onclicks = function() {
	let save_btn = document.querySelector("#lvl_save");

	save_btn.onclick = function() {
		// Create the binary stream
		let binary = [global_enigma_list.length];		
		for (let lvl of global_enigma_list) {
			binary = binary.concat(lvl.get_binary());
		}
		console.log(binary);

		// Create the file
		const blob = new Blob([new Int8Array(binary)], {type: 'octet/stream'});
  	const url = window.URL.createObjectURL(blob);
  	setTimeout(() => window.URL.revokeObjectURL(url), 1000);

  	// Download the created file
  	const a = document.createElement('a');
	  a.href = url;
	  a.download = "cube.bin";
	  document.body.appendChild(a);
	  a.style.display = 'none';
	  // a.click();
	  a.remove();
	}
}


let manager_main = function() {
	set_options();
	set_add_onclicks();
	set_save_onclicks();
}
manager_main();
