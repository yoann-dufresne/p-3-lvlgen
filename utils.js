

let face_rotations = [3, 1, 2, 3, 0, 1];

let compact_coords = function(face, row, col) {
	return ((face & 0b111) << 4) | ((row & 0b11) << 2) | ((col & 0b11) << 2);
}
