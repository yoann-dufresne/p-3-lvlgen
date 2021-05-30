
document.querySelector("#lvl_add").onclick();
document.querySelector("#lvl_list").firstChild.onclick();

// Set walls
let face = document.querySelector("#cell_0");
let walls = face.querySelectorAll(".vertical_wall, .horizontal_wall");
walls[0].onclick();
walls[1].onclick();
walls[2].onclick();
walls[3].onclick();
walls[4].onclick();
walls[5].onclick();
walls[8].onclick();
walls[12].onclick();
walls[13].onclick();
walls[15].onclick();
walls[17].onclick();
walls[19].onclick();
walls[20].onclick();
walls[22].onclick();
walls[24].onclick();
walls[26].onclick();
walls[27].onclick();
walls[31].onclick();
walls[34].onclick();
walls[35].onclick();
walls[36].onclick();
walls[37].onclick();
walls[38].onclick();
walls[39].onclick();

// Set tiles
let legends = document.querySelectorAll(".laby_legend");
let tiles = face.querySelectorAll(".tile");
console.log(tiles);
// Hero
legends[1].onclick();
tiles[0].onclick();
// Win
legends[2].onclick();
tiles[15].onclick();
// Enemy
legends[3].onclick();
tiles[14].onclick();
