var canvasw = 600;
var canvash = 800;
let board;
let background_colour = 51;

function setup() {
  createCanvas(canvasw, canvash);
  board = new Board;
  board.init();
}

function draw() {
  background(background_colour);
  board.render();
}

function mouseClicked() {
  board.parse_click_pos();
}

function axe(x, y, size) {
  const half_s = size / 2;
  line(x - half_s, y - half_s, x + half_s, y + half_s);
  line(x - half_s, y + half_s, x + half_s, y - half_s);
}

function Board() {
  this.circle_grid = 0;
  this.square_grid = 0;
  this.circle_turn = true;
  this.winning_boards = [];
  this.game_over = false;
  
  this.num_box = 3;
  
  this.init = function() {
    this.winning_boards.push(parseInt("100100100", 2));
    this.winning_boards.push(parseInt("100010001", 2));
    this.winning_boards.push(parseInt("111000000", 2));
    this.winning_boards.push(parseInt("010010010", 2));
    this.winning_boards.push(parseInt("000111000", 2));
    this.winning_boards.push(parseInt("001001001", 2));
    this.winning_boards.push(parseInt("000000111", 2));
    this.winning_boards.push(parseInt("001010100", 2));
  }

  this.check_win = function() {
    let current_grid = !this.circle_turn ? this.circle_grid : this.square_grid;
    for (let i = 0; i < this.winning_boards.length; i++) {
      if (((current_grid & this.winning_boards[i]) ^ this.winning_boards[i]) == 0) {
        this.game_over = true;
        return true;
      }
    }
    return false;
  }

  this.check_pos = function(piece) {
    return (piece & (this.circle_grid | this.square_grid)) == 0;
  }

  this.make_move = function(row, col) {
    let piece = 1;
    piece = piece << (this.num_box - col);
    piece = piece << (this.num_box * (this.num_box - row));
    if (!this.check_pos(piece)) {
      return false;
    }
    if (this.circle_turn) {
      this.circle_grid = this.circle_grid | piece;
    } else {
      this.square_grid = this.square_grid | piece;
    }
    this.circle_turn = !this.circle_turn;
    return true;
  }

  this.parse_click_pos = function() {
    if (this.game_over) {
      return;
    }

    let dim = canvash > canvasw ? Math.floor(canvasw / this.num_box) : Math.floor(canvash / this.num_box);
    let col = 1;
    let row = 1;
    for (let i = 0; i < this.num_box; i++) {
      if (mouseX > (i * dim) && mouseX <= ((i + 1) * dim)) {
        row += i;
      }
      if (mouseY > (i * dim) && mouseY <= ((i + 1) * dim)) {
        col += i;
      }
    }
    row = this.num_box - row + 1;
    col = this.num_box - col + 1;
    this.make_move(row, col);
    if (this.check_win()) {
      if (this.circle_turn) {
        background_colour = "red";
      } else {
        background_colour = "blue";
      }
    }
  }

  this.render = function() {
    let max_dim = canvash > canvasw ? canvasw : canvash;
    const num_box = this.num_box;
    for (let i = 1; i < num_box; i++) {
      stroke(250);
      line(i * (max_dim / num_box), 0, i * (max_dim / num_box), max_dim);
      line(0, i * (max_dim / num_box), max_dim, i * (max_dim / num_box));
    }

    const dim = max_dim / this.num_box;
    const offset = dim / 2;
    for (let i = 0; i < this.num_box * this.num_box; i++) {
      let col = Math.floor(i / this.num_box);
      let row = i % this.num_box;
      let piece = 1 << i;
      if ((this.circle_grid & piece) != 0) {
        ellipse(offset + (col * dim), offset + (row * dim), 50);
      } else if ((this.square_grid & piece) != 0) {
        axe(offset + (col * dim), offset + (row * dim), 50);
      }
    }
  }
}