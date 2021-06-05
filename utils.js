

let face_rotations = [1, 3, 2, 1, 0, 3];

let compact_coords = function(face, row, col) {
	return ((face & 0b111) << 4) | ((row & 0b11) << 2) | ((col & 0b11) << 0);
}

let coord_rot = function(r, c, rotation) {
	if (rotation == 0)
		return [r, c];

	return coord_rot(3-c, r, rotation-1);
}

let reverse_bits = function(value, nb_bytes) {
	let reversed = 0;
	for (let i=0 ; i<8*nb_bytes ; i++) {
		reversed |= ((value >> (8*nb_bytes-1-i)) & 0b1) << i;
	}
	return reversed;
}