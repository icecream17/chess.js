"use strict";

/*
 * Copyright (c) 2021, Steven Nguyen (icecream17.github@gmail.com)
 * Copyright (c) 2021, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 *----------------------------------------------------------------------------*/

class Chessboard extends Array {
   constructor () {
      super(128); // 128 spaces in the chessboard representation
   }
}

class Chess {
   static BLACK = 'b'
   static WHITE = 'w'

   static EMPTY = -1

   static PAWN = 'p'
   static KNIGHT = 'n'
   static BISHOP = 'b'
   static ROOK = 'r'
   static QUEEN = 'q'
   static KING = 'k'

   static SYMBOLS = 'pnbrqkPNBRQK'

   // The default fen used in the constructor
   // Also the start position
   static DEFAULT_POSITION =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

   static POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*']

   // How the pawn moves (for each side)
   static PAWN_OFFSETS = {
      b: [16, 32, 17, 15],
      w: [-16, -32, -17, -15],
   }

   // How each piece moves
   static PIECE_OFFSETS = {
      n: [-18, -33, -31, -14, 18, 33, 31, 14],
      b: [-17, -15, 17, 15],
      r: [-16, 1, 16, -1],
      q: [-17, -16, -15, 1, 17, 16, 15, -1],
      k: [-17, -16, -15, 1, 17, 16, 15, -1],
   }

   static ATTACKS = [
      20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
       0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
       0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
       0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
       0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
      24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
       0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
       0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
       0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
       0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
       0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
      20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
   ];

   // prettier-ignore
   static RAYS = [
      17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
       0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
       0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
       0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
       0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
       0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
       0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
       1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
       0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
       0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
       0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
       0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
       0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
       0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
     -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
   ];


   static SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }

   static FLAGS = {
      NORMAL: 'n',
      CAPTURE: 'c',
      BIG_PAWN: 'b',
      EP_CAPTURE: 'e',
      PROMOTION: 'p',
      KSIDE_CASTLE: 'k',
      QSIDE_CASTLE: 'q',
   }

   static BITS = {
      NORMAL: 1,
      CAPTURE: 2,
      BIG_PAWN: 4,
      EP_CAPTURE: 8,
      PROMOTION: 16,
      KSIDE_CASTLE: 32,
      QSIDE_CASTLE: 64,
   }

   static RANK_1 = 7
   static RANK_2 = 6
   static RANK_3 = 5
   static RANK_4 = 4
   static RANK_5 = 3
   static RANK_6 = 2
   static RANK_7 = 1
   static RANK_8 = 0

   static SECOND_RANK = {
      w: Chess.RANK_2,
      b: Chess.RANK_7
   }

   // prettier-ignore
   static SQUARES = {
      a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
      a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
      a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
      a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
      a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
      a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
      a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
      a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
   }

   static FIRST_SQUARE = Chess.SQUARES.a8
   static LAST_SQUARE = Chess.SQUARES.h1

   // Starting rook positions & flags
   // Used for implementing castling
   static ROOKS = {
      w: [
         { square: Chess.SQUARES.a1, flag: Chess.BITS.QSIDE_CASTLE },
         { square: Chess.SQUARES.h1, flag: Chess.BITS.KSIDE_CASTLE },
      ],
      b: [
         { square: Chess.SQUARES.a8, flag: Chess.BITS.QSIDE_CASTLE },
         { square: Chess.SQUARES.h8, flag: Chess.BITS.KSIDE_CASTLE },
      ],
   }

   /**
    * Checks if an fen is valid
    * Returns
    *    true if the fen is valid, or a
    *    string if the fen is invalid
    *
    * Todo: Check validity of actual position
    *
    * @returns {true|string}
    * @param {string} fen
    */
   static validateFen (fen) {
      if (typeof fen !== 'string') {
         return 'FEN string must... hey what is this? [Not a string]'
      }

      /* 1st criterion: 6 space-seperated fields? */
      const tokens = fen.split(/\s+/)

      if (tokens.length === 4) {
         // Add half move and full move defaults
         tokens[4] = 0
         tokens[5] = 1
      }

      if (tokens.length !== 6) {
         return 'FEN string must have 6 space-seperated fields'
      }

      tokens[4] = Number(tokens[4])
      tokens[5] = Number(tokens[5])

      /* 2nd criterion: move number field is a integer value > 0? */
      if (Number.isNaN(tokens[5])) {
         return '6th field (move number) became NaN'
      }

      if (!(Number.isInteger(tokens[5]) && tokens[5] > 0)) {
         return '6th field (move number) must be a positive integer'
      }

      /* 3rd criterion: half move counter is an integer >= 0? */
      if (Number.isNaN(tokens[4])) {
         return '5th field (half move counter) became NaN'
      }

      if (!(Number.isInteger(tokens[4]) && tokens[4] >= 0)) {
         return '5th field (half move counter) must be a non-negative integer'
      }

      /* 4th criterion: 4th field is a valid e.p.-string? */
      if (!/^(-|[abcdefgh][123456789])$/.test(tokens[3])) {
         return '4th field (en-passant square) is invalid [not a square]'
      }

      /* 5th criterion: 3th field is a valid castle-string? */
      if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
         return '3rd field (castling availability) is invalid'
      }

      /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */
      if (!/^(w|b)$/.test(tokens[1])) {
        return '2nd field (side to move) is invalid [must be "w" or "b"]'
      }

      /* 7th criterion: 1st field contains 8 rows? */
      // hey - this is the stackoverflow way to count occurences of char in string
      const rows = tokens[0].split('/')
      if (rows.length !== 8) {
        return '1st field (board) must contain 8 "/"-separated rows' // solidus
      }

      /* 8th criterion: every row is valid? */
      for (let i = 0; i < rows.length; i++) {
         /* check for right sum of fields AND not two numbers in succession */
         let sum_fields = 0
         let previous_was_number = false

         for (var k = 0; k < rows[i].length; k++) {
            if (!isNaN(rows[i][k])) {
               if (previous_was_number) {
                  return '1st field (board) is invalid [consecutive numbers]'
               }
               sum_fields += utils.nonZeroDigit[rows[i][k]]
               previous_was_number = true
            } else {
               if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                  return '1st field (board) is invalid [invalid piece]'
               }
               sum_fields++
               previous_was_number = false
            }
         }
         if (sum_fields !== 8) {
            return '1st field (board) is invalid [row too large]'
         }
      }

      if (
         (tokens[3][1] === '3' && tokens[1] === 'w') ||
         (tokens[3][1] === '6' && tokens[1] === 'b')
      ) {
         return '4th field is invalid: Illegal en passant square'
      }

      /* everything's okay! */
      return true
   }

   constructor (fen=Chess.DEFAULT_POSITION) {
      this._board = new Chessboard()

      // Might want to move this to Chessboard
      this.kings = { w: Chess.EMPTY, b: Chess.EMPTY }
      this.turn = Chess.WHITE
      this.castling = { w: 0, b: 0 }
      this.enPassantSquare = Chess.EMPTY
      this.halfMoves = 0
      this.moveNumber = 1
      this._history = []

      this._header = {}
      this.comments = {}

      // Loads the fen
      // The default fen is the starting position
      this.load(fen)

      const self = this
      this.header = function header (...args) {
         return self.set_header(args)
      }
   }

   clear(keepHeaders=false) {
      this._board = new Chessboard()
      this.kings = { w: Chess.EMPTY, b: Chess.EMPTY }
      this.turn = Chess.WHITE
      this.castling = { w: 0, b: 0 }
      this.enPassantSquare = Chess.EMPTY
      this.halfMoves = 0
      this.moveNumber = 1
      this._history = []
      if (!keepHeaders) this._header = {}
      this.comments = {}
      this.update_setup(this.generate_fen())
   }

   /** Removes all comments whose fen is not in the move history */
   prune_comments() {
      const reversed_history = []
      const current_comments = {}
      const copy_comment = fen => {
         if (fen in this.comments) {
            current_comments[fen] = this.comments[fen]
         }
      }
      while (this._history.length > 0) {
         reversed_history.push(this.undo_move())
      }
      copy_comment(this.generate_fen())
      while (reversed_history.length > 0) {
         this.make_move(reversed_history.pop())
         copy_comment(this.generate_fen())
      }
      this.comments = current_comments
   }

   reset() {
      this.load(Chess.DEFAULT_POSITION)
   }

   load(fen, keepHeaders=false) {
      if (Chess.validateFen(fen) !== true) {
         return false
      }

      this.clear(keepHeaders)

      const tokens = fen.split(/\s+/)
      const position = tokens[0]
      let square = 0

      for (const char of position) {
         if (char === '/') {
            square += 8 // The board is represented like this: ________######## x8
         } else if ('123456789'.includes(char)) {
            square += parseInt(char, 10)
         } else {
            const piece = char.toLowerCase()

            // Pieces are differentiated by lower vs uppercase
            if (piece === char) {
               // Try to place the piece, if it fails, (maybe because there's too many kings),
               // clear the board and return false
               if (!this.put({ type: piece, color: Chess.BLACK }, utils.algebraic(square))) {
                  this.clear(keepHeaders)
                  return false
               }
            } else {
               if (!this.put({ type: piece, color: Chess.WHITE }, utils.algebraic(square))) {
                  this.clear(keepHeaders)
                  return false
               }
            }

            square++
         }
      }

      this.turn = tokens[1]

      if (tokens[2].indexOf('K') > -1) {
         this.castling.w |= Chess.BITS.KSIDE_CASTLE
      }
      if (tokens[2].indexOf('Q') > -1) {
         this.castling.w |= Chess.BITS.QSIDE_CASTLE
      }
      if (tokens[2].indexOf('k') > -1) {
         this.castling.b |= Chess.BITS.KSIDE_CASTLE
      }
      if (tokens[2].indexOf('q') > -1) {
         this.castling.b |= Chess.BITS.QSIDE_CASTLE
      }

      
      this.enPassantSquare = tokens[3] === '-' ? Chess.EMPTY : Chess.SQUARES[tokens[3]]
      this.halfMoves = parseInt(tokens[4] ?? 0, 10)
      this.moveNumber = parseInt(tokens[5] ?? 1, 10)

      this.update_setup(this.generate_fen())

      return true
   }

   generate_fen() {
      let empty = 0
      let fen = ''

      for (let i = Chess.SQUARES.a8; i <= Chess.SQUARES.h1; i++) {
        if (this._board[i] == null) {
          empty++
        } else {
          if (empty > 0) {
            fen += empty
            empty = 0
          }
          const color = this._board[i].color
          const piece = this._board[i].type

          fen += color === Chess.WHITE ? piece.toUpperCase() : piece.toLowerCase()
        }

        if ((i + 1) & 0x88) {
          if (empty > 0) {
            fen += empty
          }

          if (i !== Chess.SQUARES.h1) {
            fen += '/'
          }

          empty = 0
          i += 8
        }
      }

      let cflags = ''
      if (this.castling[Chess.WHITE] & Chess.BITS.KSIDE_CASTLE) {
        cflags += 'K'
      }
      if (this.castling[Chess.WHITE] & Chess.BITS.QSIDE_CASTLE) {
        cflags += 'Q'
      }
      if (this.castling[Chess.BLACK] & Chess.BITS.KSIDE_CASTLE) {
        cflags += 'k'
      }
      if (this.castling[Chess.BLACK] & Chess.BITS.QSIDE_CASTLE) {
        cflags += 'q'
      }

      /* do we have an empty castling flag? */
      cflags = cflags || '-'
      const epflags = this.enPassantSquare === Chess.EMPTY ? '-' : utils.algebraic(this.enPassantSquare)

      return [fen, this.turn, cflags, epflags, this.halfMoves, this.moveNumber].join(' ')
  }

  set_header(args) {
    for (let i = 0; i < args.length; i += 2) {
      if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
        this._header[args[i]] = args[i + 1]
      }
    }
    return this._header
  }

   /**
    * Called when the initial board setup is changed with put() or remove(), and
    * modifies the SetUp and FEN properties of the header object.
    *
    * If the FEN is equal to the default position, the SetUp and FEN are deleted
    * The setup is only updated if history.length is zero, ie moves haven't been
    * made.
    */
   update_setup(fen) {
      if (this._history.length > 0) return

      if (fen !== Chess.DEFAULT_POSITION) {
         this._header['SetUp'] = '1'
         this._header['FEN'] = fen
      } else {
         delete this._header['SetUp']
         delete this._header['FEN']
      }
   }

   get(square) {
      const piece = this._board[Chess.SQUARES[square]]
      return piece ? {...piece} : null
   }

   put(piece, square) {
      /* check for valid piece object */
      if (piece?.type == undefined || piece?.color == undefined) {
         return false
      }

      /* check for piece */
      if (!Chess.SYMBOLS.includes(piece.type.toLowerCase())) {
         return false
      }

      /* check for valid square */
      if (!(square in Chess.SQUARES)) {
         return false
      }

      
      const sq = Chess.SQUARES[square]

      /* don't let the user place more than one king */
      if (
         piece.type === Chess.KING &&
         !(this.kings[piece.color] === Chess.EMPTY || this.kings[piece.color] === sq)
      ) {
         return false
      }

      this._board[sq] = { type: piece.type, color: piece.color }
      if (piece.type === Chess.KING) {
         this.kings[piece.color] = sq
      }

      this.update_setup(this.generate_fen())

      return true
   }

   remove(square) {
      const piece = this.get(square)
      this._board[Chess.SQUARES[square]] = null
      if (piece?.type === Chess.KING) {
         this.kings[piece.color] = Chess.EMPTY
      }

      this.update_setup(this.generate_fen())

      return piece
   }

   build_move(board, from, to, flags, promotion) {
      const move = {
         color: this.turn,
         from,
         to,
         flags,
         piece: board[from].type
      }

      if (promotion) {
         move.flags |= Chess.BITS.PROMOTION
         move.promotion = promotion
      }

      if (board[to]) {
         move.captured = board[to].type
      } else if (flags & Chess.BITS.EP_CAPTURE) {
         move.captured = Chess.PAWN
      }

      return move
   }

   ___generate_pseudolegal_moves(options) {
      const add_move = (board, moves, from, to, flags) => {
         /* if pawn promotion */
         if (
            board[from].type === Chess.PAWN &&
            (utils.rank(to) === Chess.RANK_8 || utils.rank(to) === Chess.RANK_1))
         {
            for (const piece of [Chess.QUEEN, Chess.ROOK, Chess.BISHOP, Chess.KNIGHT]) {
               moves.push(this.build_move(board, from, to, flags, piece))
            }
         } else {
            moves.push(this.build_move(board, from, to, flags))
         }
      }

      const moves = []
      const us = this.turn
      const them = utils.oppositeColor[us]
      let single_square = false

      const piece_type =
         typeof options?.piece === 'string'
            ? options.piece.toLowerCase()
            : true

      /* are we generating moves for a single square? */
      let searchRange = [Chess.FIRST_SQUARE, Chess.LAST_SQUARE]
      if (options !== undefined && 'square' in options) {
         if (options.square in Chess.SQUARES) {
            searchRange = [Chess.SQUARES[options.square], Chess.SQUARES[options.square]]
            single_square = true
         } else {
            /* invalid square */
            return []
         }
      }

      for (let i = searchRange[0]; i <= searchRange[1]; i++) {
         /* did we run off the end of the board */
         if (i & 0x88) {
            i += 7
            continue
         }

         const piece = this._board[i]
         if (piece?.color !== us) {
            continue
         }

         // pawns are special
         if (piece.type === Chess.PAWN && (piece_type === true || piece_type === Chess.PAWN)) {
            // single square, non capturing
            let toSquare = i + Chess.PAWN_OFFSETS[us][0]
            if (this._board[toSquare] == null) {
               add_move(this._board, moves, i, toSquare, Chess.BITS.NORMAL)

               let toSquareShadow = i + Chess.PAWN_OFFSETS[us][1]
               if (Chess.SECOND_RANK[us] === utils.rank(i) && this._board[toSquareShadow] == null) {
                  add_move(this._board, moves, i, toSquareShadow, Chess.BITS.BIG_PAWN)
               }
            }

            /* pawn captures */
            for (let j = 2; j < 4; j++) {
               const square = i + Chess.PAWN_OFFSETS[us][j]
               if (square & 0x88) continue

               if (this._board[square] != null && this._board[square].color === them) {
                  add_move(this._board, moves, i, square, Chess.BITS.CAPTURE)
               } else if (square === this.enPassantSquare) {
                  add_move(this._board, moves, i, this.enPassantSquare, Chess.BITS.EP_CAPTURE)
               }
            }
         } else if (piece_type === true || piece_type === piece.type) {
            for (const offset of Chess.PIECE_OFFSETS[piece.type]) {
               let square = i

               while (true) {
                  square += offset
                  if (square & 0x88) break // off the board

                  if (this._board[square] == null) {
                     add_move(this._board, moves, i, square, Chess.BITS.NORMAL)
                  } else {
                     if (this._board[square].color === us) break
                     add_move(this._board, moves, i, square, Chess.BITS.CAPTURE)
                     break
                  }

                  /* Knights and kings can only move in a direction once. */
                  if (piece.type === Chess.KNIGHT || piece.type === Chess.KING) break
               }
            }

            /* check for castling if: a) we're generating all moves, or b) we're doing
             * single square move generation on the king's square
             */
            if (piece.type === Chess.KING) {
               if (!single_square || searchRange[1] === this.kings[us]) {
                  /* king-side castling */
                  if (this.castling[us] & Chess.BITS.KSIDE_CASTLE) {
                     const castling_from = this.kings[us]
                     const castling_to = castling_from + 2

                     if (
                        this._board[castling_from + 1] == null &&
                        this._board[castling_to] == null &&
                        !this.attacked(them, this.kings[us]) &&
                        !this.attacked(them, castling_from + 1) &&
                        !this.attacked(them, castling_to)
                     ) {
                        add_move(this._board, moves, this.kings[us], castling_to, Chess.BITS.KSIDE_CASTLE)
                     }
                  }

                  /* queen-side castling */
                  if (this.castling[us] & Chess.BITS.QSIDE_CASTLE) {
                     const castling_from = this.kings[us]
                     const castling_to = castling_from - 2

                     if (
                         this._board[castling_from - 1] == null &&
                         this._board[castling_from - 2] == null &&
                         this._board[castling_from - 3] == null &&
                         !this.attacked(them, this.kings[us]) &&
                         !this.attacked(them, castling_from - 1) &&
                         !this.attacked(them, castling_to))
                     {
                        add_move(this._board, moves, this.kings[us], castling_to, Chess.BITS.QSIDE_CASTLE)
                     }
                  }
               }
            } // End castling
         }
      } // End loop
      return moves
   }

   ___generate_legal_moves(options) {
      const pseudolegalmoves = this.___generate_pseudolegal_moves(options)
      const us = this.turn

      /* filter out illegal moves */
      const legal_moves = []
      for (let i = 0, len = pseudolegalmoves.length; i < len; i++) {
         this.make_move(pseudolegalmoves[i])
         if (!this.king_attacked(us)) {
           legal_moves.push(pseudolegalmoves[i])
         }
         this.undo_move()
      }

      return legal_moves
   }

   ___generate_moves(options) {
      if (options?.legal ?? true) {
         return this.___generate_legal_moves(options)
      } else {
         return this.___generate_pseudolegal_moves(options)
      }
   }

   /* convert a move from 0x88 coordinates to Standard Algebraic Notation
    * (SAN)
    *
    * @param {boolean} sloppy Use the sloppy SAN generator to work around over
    * disambiguation bugs in Fritz and Chessbase.  See below:
    *
    * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
    * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
    * 4. ... Ne7 is technically the valid SAN
    */
   move_to_san(move, moves) {
      let output = ''

      if (move.flags & Chess.BITS.KSIDE_CASTLE) {
         output = 'O-O'
      } else if (move.flags & Chess.BITS.QSIDE_CASTLE) {
         output = 'O-O-O'
      } else {
         if (move.piece !== Chess.PAWN) {
            const disambiguator = this.get_disambiguator(move, moves)
            output += move.piece.toUpperCase() + disambiguator
         }

         if (move.flags & (Chess.BITS.CAPTURE | Chess.BITS.EP_CAPTURE)) {
            if (move.piece === Chess.PAWN) {
               output += utils.algebraicFile(move.from)
            }
            output += 'x'
         }

         output += utils.algebraic(move.to)

         if (move.flags & Chess.BITS.PROMOTION) {
            output += '=' + move.promotion.toUpperCase()
         }
      }

      this.make_move(move)
      if (this.in_check()) {
         if (this.in_checkmate()) {
            output += '#'
         } else {
            output += '+'
         }
      }
      this.undo_move()

      return output
   }

   move_to_stripped_san(move, moves) {
      let output = ''

      if (move.flags & Chess.BITS.KSIDE_CASTLE) {
         output = 'O-O'
      } else if (move.flags & Chess.BITS.QSIDE_CASTLE) {
         output = 'O-O-O'
      } else {
         if (move.piece !== Chess.PAWN) {
            const disambiguator = this.get_disambiguator(move, moves)
            output += move.piece.toUpperCase() + disambiguator
         }

         if (move.flags & (Chess.BITS.CAPTURE | Chess.BITS.EP_CAPTURE)) {
            if (move.piece === Chess.PAWN) {
               output += utils.algebraicFile(move.from)
            }
            output += 'x'
         }

         output += utils.algebraic(move.to)

         if (move.flags & Chess.BITS.PROMOTION) {
            output += move.promotion.toUpperCase()
         }
      }

      return output
   }

   // parses all of the decorators out of a SAN string
   static stripped_san(move) {
      return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '')
   }

   attacked(color, square) {
      for (let i = Chess.SQUARES.a8; i <= Chess.SQUARES.h1; i++) {
         /* did we run off the end of the board */
         if (i & 0x88) {
            i += 7
            continue
         }

         /* if empty square or wrong color */
         if (this._board[i] == null || this._board[i].color !== color) continue

         const piece = this._board[i]
         const difference = i - square
         const index = difference + 119

         if (Chess.ATTACKS[index] & (1 << Chess.SHIFTS[piece.type])) {
            if (piece.type === Chess.PAWN) {
               if (difference > 0) {
                  if (piece.color === Chess.WHITE) return true
               } else {
                  if (piece.color === Chess.BLACK) return true
               }
               continue
            }

            if (piece.type === Chess.KNIGHT || piece.type === Chess.KING) return true

            const offset = Chess.RAYS[index]
            let j = i + offset

            let blocked = false
            while (j !== square) {
               if (this._board[j] != null) {
                  blocked = true
                  break
               }
               j += offset
            }

            if (!blocked) return true
         }
      }

      return false
   }

   king_attacked(color) {
      return this.attacked(utils.oppositeColor[color], this.kings[color])
   }

   in_check() {
      return this.king_attacked(this.turn)
   }

   in_checkmate() {
      return this.in_check() && this.___generate_moves().length === 0
   }

   in_stalemate() {
      return !this.in_check() && this.___generate_moves().length === 0
   }

   insufficient_material() {
      let pieces = {}
      let bishopSqColors = new Set()
      let num_pieces = 0
      let sq_color = 0

      for (let i = Chess.SQUARES.a8; i <= Chess.SQUARES.h1; i++) {
         sq_color = sq_color ^ 1 // toggle sq_color
         if (i & 0x88) {
            i += 7
            continue
         }

         const piece = this._board[i]
         if (piece /* != null */) {
            pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1
            if (piece.type === Chess.BISHOP) {
               bishopSqColors.add(sq_color)
            }
            num_pieces++
         }
      }

      /* k vs k */
      if (num_pieces === 2) {
         return true
      } else if (
         /* k vs kn || k vs kb */
         num_pieces === 3 &&
         (pieces[Chess.BISHOP] === 1 || pieces[Chess.KNIGHT] === 1)
      ) {
        return true
      } else if (num_pieces === pieces[Chess.BISHOP] + 2) {
         /* kb vs. kb where any number of bishops are all on the same color */
         if (!(bishopSqColors.has(0) && bishopSqColors.has(1))) {
            return true
         }
      }

      return false
   }

   in_threefold_repetition() {
      /* TODO: while this function is fine for casual use, a better
       * implementation would use a Zobrist key (instead of FEN). the
       * Zobrist key would be maintained in the make_move/undo_move functions,
       * avoiding the costly that we do below.
       */
      const moves = []
      const positions = {}
      let repetition = false

      while (true) {
         const move = this.undo_move()
         if (!move) break
         moves.push(move)
      }

      while (true) {
         /* remove the last two fields in the FEN string, they're not needed
          * when checking for draw by rep */
         const fen = this.generate_fen().split(' ').slice(0, 4).join(' ')

         /* has the position occurred three or more times? */
         positions[fen] = fen in positions ? positions[fen] + 1 : 1
         if (positions[fen] >= 3) {
            repetition = true
            while (moves.length > 0) {
               this.make_move(moves.pop())
            }
            break
         }

         if (!moves.length) {
            break
         }
         this.make_move(moves.pop())
      }

      return repetition
   }

   push(move) {
      this._history.push({
         move,
         kings: {...this.kings},
         turn: this.turn,
         castling: {...this.castling},
         enPassantSquare: this.enPassantSquare,
         halfMoves: this.halfMoves,
         moveNumber: this.moveNumber
      })
   }

   make_move(move) {
      const us = this.turn
      const them = utils.oppositeColor[us]
      this.push(move)

      this._board[move.to] = this._board[move.from]
      delete this._board[move.from]

      /* en passant */
      if (move.flags & Chess.BITS.EP_CAPTURE) {
         if (this.turn === Chess.BLACK) {
            delete this._board[move.to - 16]
         } else {
            delete this._board[move.to + 16]
         }
      }

      /* pawn promotion */
      else if (move.flags & Chess.BITS.PROMOTION) {
         this._board[move.to] = { type: move.promotion, color: us }
      }

      /* if moving the king */
      else if (this._board[move.to].type === Chess.KING) {
         this.kings[this._board[move.to].color] = move.to

         /* if we castled, move the rook next to the king */
         if (move.flags & Chess.BITS.KSIDE_CASTLE) {
            const castling_to = move.to - 1
            const castling_from = move.to + 1
            this._board[castling_to] = this._board[castling_from]
            delete this._board[castling_from]
         } else if (move.flags & Chess.BITS.QSIDE_CASTLE) {
            const castling_to = move.to + 1
            const castling_from = move.to - 2
            this._board[castling_to] = this._board[castling_from]
            delete this._board[castling_from]
         }

         /* turn off castling */
         this.castling[us] = ''
      }

      /* turn off castling if we move a rook */
      if (this.castling[us]) {
         for (let i = 0, len = Chess.ROOKS[us].length; i < len; i++) {
            if (
               move.from === Chess.ROOKS[us][i].square &&
               this.castling[us] & Chess.ROOKS[us][i].flag
            ) {
               this.castling[us] ^= Chess.ROOKS[us][i].flag
               break
            }
         }
      }

      /* turn off castling if we capture a rook */
      if (this.castling[them]) {
         for (let i = 0, len = Chess.ROOKS[them].length; i < len; i++) {
            if (
               move.to === Chess.ROOKS[them][i].square &&
               this.castling[them] & Chess.ROOKS[them][i].flag
            ) {
               this.castling[them] ^= Chess.ROOKS[them][i].flag
               break
            }
         }
      }


      /* if big pawn move, update the en passant square */
      if (move.flags & Chess.BITS.BIG_PAWN) {
         if (this.turn === Chess.BLACK) {
            this.enPassantSquare = move.to - 16
         } else {
            this.enPassantSquare = move.to + 16
         }
      } else {
         this.enPassantSquare = Chess.EMPTY
      }

      /* reset the 50 move counter if a pawn is moved or a piece is captured */
      if (move.piece === Chess.PAWN) {
        this.halfMoves = 0
      } else if (move.flags & (Chess.BITS.CAPTURE | Chess.BITS.EP_CAPTURE)) {
        this.halfMoves = 0
      } else {
        this.halfMoves++
      }

      if (this.turn === Chess.BLACK) {
        this.moveNumber++
      }
      this.turn = utils.oppositeColor[this.turn]
   }

   undo_move() {
      const old = this._history.pop()
      if (old == null) {
         return null
      }

      const move = old.move
      this.kings = old.kings
      this.turn = old.turn
      this.castling = old.castling
      this.enPassantSquare = old.enPassantSquare
      this.halfMoves = old.halfMoves
      this.moveNumber = old.moveNumber

      const us = this.turn
      const them = utils.oppositeColor[this.turn]

      this._board[move.from] = this._board[move.to]
      this._board[move.from].type = move.piece // to undo any promotions
      delete this._board[move.to]

      if (move.flags & Chess.BITS.CAPTURE) {
        this._board[move.to] = { type: move.captured, color: them }
      } else if (move.flags & Chess.BITS.EP_CAPTURE) {
        let index
        if (us === Chess.BLACK) {
          index = move.to - 16
        } else {
          index = move.to + 16
        }
        this._board[index] = { type: Chess.PAWN, color: them }
      }

      if (move.flags & (Chess.BITS.KSIDE_CASTLE | Chess.BITS.QSIDE_CASTLE)) {
         let castling_to, castling_from
         if (move.flags & Chess.BITS.KSIDE_CASTLE) {
            castling_to = move.to + 1
            castling_from = move.to - 1
         } else if (move.flags & Chess.BITS.QSIDE_CASTLE) {
            castling_to = move.to - 2
            castling_from = move.to + 1
         }

         this._board[castling_to] = this._board[castling_from]
         delete this._board[castling_from]
      }

      return move
   }


   /* this function is used to uniquely identify ambiguous moves */
   get_disambiguator(move, moves) {
      const from = move.from
      const to = move.to
      const piece = move.piece

      let ambiguities = 0
      let same_rank = 0
      let same_file = 0

      for (let i = 0, len = moves.length; i < len; i++) {
        const ambig_from = moves[i].from
        const ambig_to = moves[i].to
        const ambig_piece = moves[i].piece

        /* if a move of the same piece type ends on the same to square, we'll
         * need to add a disambiguator to the algebraic notation
         */
        if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
          ambiguities++

          if (utils.rank(from) === utils.rank(ambig_from)) {
            same_rank++
          }

          if (utils.file(from) === utils.file(ambig_from)) {
            same_file++
          }
        }
      }

      if (ambiguities > 0) {
        /* if there exists a similar moving piece on the same rank and file as
         * the move in question, use the square as the disambiguator
         */
        if (same_rank > 0 && same_file > 0) {
          return utils.algebraic(from)
        } else if (same_file > 0) {
          /* if the moving piece rests on the same file, use the rank symbol as the
           * disambiguator
           */
          return utils.algebraic(from).charAt(1)
        } else {
          /* else use the file symbol */
          return utils.algebraic(from).charAt(0)
        }
      }

      return ''
   }

   static infer_piece_type(san) {
      let piece_type = san.charAt(0)
      if (piece_type >= 'a' && piece_type <= 'h') {
         const matches = san.match(/[a-h]\d.*[a-h]\d/)
         if (matches) {
            return undefined
         }
         return Chess.PAWN
      }
      piece_type = piece_type.toLowerCase()
      if (piece_type === 'o') {
         return Chess.KING
      }
      return piece_type
   }

   ascii() {
      let s = '   +------------------------+\n'
      for (let i = Chess.SQUARES.a8; i <= Chess.SQUARES.h1; i++) {
        /* display the rank */
        if (utils.file(i) === 0) {
          s += ' ' + '87654321'[utils.rank(i)] + ' |'
        }

        /* empty piece */
        if (this._board[i] == null) {
          s += ' . '
        } else {
          const piece = this._board[i].type
          const color = this._board[i].color
          const symbol = color === Chess.WHITE ? piece.toUpperCase() : piece.toLowerCase()
          s += ` ${symbol} `
        }

        if ((i + 1) & 0x88) {
          s += '|\n'
          i += 8
        }
      }
      s += '   +------------------------+\n'
      s += '     a  b  c  d  e  f  g  h\n'

      return s
   }

   
   // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates
   move_from_san(move, sloppy) {
      // strip off any move decorations: e.g Nf3+?!
      const clean_move = Chess.stripped_san(move)
      let piece = null
      let from = null
      let to = null
      let promotion = null
      let matches = null

      // if we're using the sloppy parser run a regex to grab piece, to, and from
      // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7
      if (sloppy) {
        matches = clean_move.match(
          /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
        )
        if (matches) {
           piece = matches[1]
           from = matches[2]
           to = matches[3]
           promotion = matches[4]
        }
      }

      let piece_type = Chess.infer_piece_type(clean_move)
      let moves = null
      let legalMoves = this.___generate_legal_moves({
        piece: piece ? piece : piece_type,
      })
      let illegalMoves = undefined

      moves = legalMoves
      if (sloppy) {
         moves = illegalMoves = this.___generate_pseudolegal_moves({
            legal: false,
            piece: piece ? piece : piece_type,
         })
      }

      for (let i = 0, len = moves.length; i < len; i++) {
         // try the strict parser first, then the sloppy parser if requested
         // by the user
         if (
            clean_move === this.move_to_stripped_san(moves[i], legalMoves) ||
            (sloppy &&
               clean_move === this.move_to_stripped_san(moves[i], illegalMoves))
         ) {
            return moves[i]
         } else {
            if (
               matches &&
               (!piece || piece.toLowerCase() == moves[i].piece) &&
               Chess.SQUARES[from] == moves[i].from &&
               Chess.SQUARES[to] == moves[i].to &&
               (!promotion || promotion.toLowerCase() == moves[i].promotion)
            ) {
               return moves[i]
            }
         }
      }

      return null
   }


   // Also a util, but it has to be a method of the instance
   /* pretty = external move object */
   make_pretty(ugly_move) {
      const move = utils.clone(ugly_move)
      move.san = this.move_to_san(move, this.___generate_moves({ legal: true }))
      move.to = utils.algebraic(move.to)
      move.from = utils.algebraic(move.from)

      let flags = ''

      for (const flag in Chess.BITS) {
         if (Chess.BITS[flag] & move.flags) {
            flags += Chess.FLAGS[flag]
         }
      }
      move.flags = flags

      return move
   }

   /* Public api          Note that some public api methods are also above
    ********************************/
   moves (options) {
      /* The internal representation of a chess move is in 0x88 format, and
       * not meant to be human-readable.  The code below converts the 0x88
       * square coordinates to algebraic coordinates.  It also prunes an
       * unnecessary move keys resulting from a verbose call.
       */

      const ugly_moves = this.___generate_moves(options)
      const moves = []

      for (let i = 0, len = ugly_moves.length; i < len; i++) {
        /* does the user want a full move object (most likely not), or just
         * SAN
         */
        if (options?.verbose) {
          moves.push(this.make_pretty(ugly_moves[i]))
        } else {
          moves.push(
            this.move_to_san(ugly_moves[i], this.___generate_legal_moves())
          )
        }
      }

      return moves
   }
   in_draw () {
      return (
         this.half_moves >= 100 ||
         this.in_stalemate() ||
         this.insufficient_material() ||
         this.in_threefold_repetition()
      )
   }
   game_over () {
      // wanna check threefold repetition
      return (
         this.half_moves >= 100 ||
         this.in_checkmate() ||
         this.in_stalemate() ||
         this.insufficient_material() ||
         this.in_threefold_repetition()
      )
   }
   fen () {
      return this.generate_fen()
   }
   board () {
      let output = []
      let row = []

      for (let i = Chess.SQUARES.a8; i <= Chess.SQUARES.h1; i++) {
        if (this._board[i] == null) {
          row.push(null)
        } else {
          row.push({...this._board[i]})
        }
        if ((i + 1) & 0x88) {
          output.push(row)
          row = []
          i += 8
        }
      }

      return output
   }

   pgn (options) {
      /* using the specification from http://www.chessclub.com/help/PGN-spec
       * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
       */
      const newline = options?.newline_char ?? '\n'
      let max_width = 
        typeof options?.max_width === 'number'
          ? options.max_width
          : 0
      let result = []
      let header_exists = false

      /* add the PGN header headerrmation */
      for (const i in this._header) {
        /* TODO: order of enumerated properties in header object is not
         * guaranteed, see ECMA-262 spec (section 12.6.4)
         */
        result.push('[' + i + ' "' + this._header[i] + '"]' + newline)
        header_exists = true
      }

      if (header_exists && this._history.length) {
        result.push(newline)
      }

      const append_comment = move_string => {
        const comment = this.comments[this.generate_fen()]
        if (typeof comment !== 'undefined') {
          const delimiter = move_string.length > 0 ? ' ' : ''
          move_string = `${move_string}${delimiter}{${comment}}`
        }
        return move_string
      }

      /* pop all of history onto reversed_history */
      let reversed_history = []
      while (this._history.length > 0) {
        reversed_history.push(this.undo_move())
      }

      let moves = []
      let move_string = ''

      /* special case of a commented starting position with no moves */
      if (reversed_history.length === 0) {
        moves.push(append_comment(''))
      }

      /* build the list of moves.  a move_string looks like: "3. e3 e6" */
      while (reversed_history.length > 0) {
        move_string = append_comment(move_string)
        const move = reversed_history.pop()

        /* if the position started with black to move, start PGN with 1. ... */
        if (!this._history.length && move.color === Chess.BLACK) {
          move_string = this.moveNumber + '. ...'
        } else if (move.color === Chess.WHITE) {
          /* store the previous generated move_string if we have one */
          if (move_string.length) {
            moves.push(move_string)
          }
          move_string = this.moveNumber + '.'
        }

        move_string +=
          ' ' +
          this.move_to_san(move, this.___generate_pseudolegal_moves())
        this.make_move(move)
      }

      /* are there any other leftover moves? */
      if (move_string.length) {
        moves.push(append_comment(move_string))
      }

      /* is there a result? */
      if (typeof this._header.Result !== 'undefined') {
        moves.push(this._header.Result)
      }

      /* history should be back to what it was before we started generating PGN,
       * so join together moves
       */
      if (max_width === 0) {
        return result.join('') + moves.join(' ')
      }

      const strip = function () {
        if (result.length > 0 && result[result.length - 1] === ' ') {
          result.pop()
          return true
        }
        return false
      }

      /* NB: this does not preserve comment whitespace. */
      const wrap_comment = function (width, move) {
        for (const token of move.split(' ')) {
          if (!token) {
            continue
          }
          if (width + token.length > max_width) {
            while (strip()) {
              width--
            }
            result.push(newline)
            width = 0
          }
          result.push(token)
          width += token.length
          result.push(' ')
          width++
        }
        if (strip()) {
          width--
        }
        return width
      }

      /* wrap the PGN output at max_width */
      let current_width = 0
      for (let i = 0; i < moves.length; i++) {
        if (current_width + moves[i].length > max_width) {
          if (moves[i].includes('{')) {
            current_width = wrap_comment(current_width, moves[i])
            continue
          }
        }
        /* if the current move will push past max_width */
        if (current_width + moves[i].length > max_width && i !== 0) {
          /* don't end the line with whitespace */
          if (result[result.length - 1] === ' ') {
            result.pop()
          }

          result.push(newline)
          current_width = 0
        } else if (i !== 0) {
          result.push(' ')
          current_width++
        }
        result.push(moves[i])
        current_width += moves[i].length
      }

      return result.join('')
    }

    load_pgn (pgn, options) {
      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      const sloppy = options?.sloppy ?? false

      function mask(str) {
        return str.replace(/\\/g, '\\')
      }

      function has_keys(object) {
        for (const key in object) {
          return true
        }
        return false
      }

      function parse_pgn_header(header, options) {
        const newline_char =
          typeof options === 'object' &&
          typeof options.newline_char === 'string'
            ? options.newline_char
            : '\r?\n'
        const header_obj = {}
        const headers = header.split(new RegExp(mask(newline_char)))
        let key = ''
        let value = ''

        for (let i = 0; i < headers.length; i++) {
          key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1')
          value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\ *\]$/, '$1')
          if (key.trim().length > 0) {
            header_obj[key] = value
          }
        }

        return header_obj
      }

      const newline_char =
        typeof options === 'object' && typeof options.newline_char === 'string'
          ? options.newline_char
          : '\r?\n'

      // RegExp to split header. Takes advantage of the fact that header and movetext
      // will always have a blank line between them (ie, two newline_char's).
      // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/
      const header_regex = new RegExp(
        '^(\\[((?:' +
          mask(newline_char) +
          ')|.)*\\])' +
          '(?:' +
          mask(newline_char) +
          '){2}'
      )

      // If no header given, begin with moves.
      const header_string = header_regex.test(pgn)
        ? header_regex.exec(pgn)[1]
        : ''

      // Put the board in the starting position
      this.reset()

      /* parse PGN header */
      const headers = parse_pgn_header(header_string, options)
      for (const key in headers) {
        this.set_header([key, headers[key]])
      }

      /* load the starting position indicated by [Setup '1'] and
       * [FEN position] */
      if (headers['SetUp'] === '1') {
        if (!('FEN' in headers && this.load(headers['FEN'], true))) {
          // second argument to load: don't clear the headers
          return false
        }
      }

      /* NB: the regexes below that delete move numbers, recursive
       * annotations, and numeric annotation glyphs may also match
       * text in comments. To prevent this, we transform comments
       * by hex-encoding them in place and decoding them again after
       * the other tokens have been deleted.
       *
       * While the spec states that PGN files should be ASCII encoded,
       * we use {en,de}codeURIComponent here to support arbitrary UTF8
       * as a convenience for modern users */

      const to_hex = function (string) {
        return Array.from(string)
          .map(c => (
            /* encodeURI doesn't transform most ASCII characters,
             * so we handle these ourselves */
            c.charCodeAt(0) < 128
              ? c.charCodeAt(0).toString(16)
              : encodeURIComponent(c).replace(/\%/g, '').toLowerCase()
          ))
          .join('')
      }

      const from_hex = function (string) {
        return string.length == 0
          ? ''
          : decodeURIComponent('%' + string.match(/.{1,2}/g).join('%'))
      }

      const encode_comment = function (string) {
        string = string.replace(new RegExp(mask(newline_char), 'g'), ' ')
        return `{${to_hex(string.slice(1, string.length - 1))}}`
      }

      const decode_comment = function (string) {
        if (string.startsWith('{') && string.endsWith('}')) {
          return from_hex(string.slice(1, string.length - 1))
        }
      }

      /* delete header to get the moves */
      let ms = pgn
        .replace(header_string, '')
        .replace(
          /* encode comments so they don't get deleted below */
          new RegExp(`(\{[^}]*\})+?|;([^${mask(newline_char)}]*)`, 'g'),
          function (match, bracket, semicolon) {
            return bracket !== undefined
              ? encode_comment(bracket)
              : ' ' + encode_comment(`{${semicolon.slice(1)}}`)
          }
        )
        .replace(new RegExp(mask(newline_char), 'g'), ' ')

      /* delete recursive annotation variations */
      const rav_regex = /(\([^\(\)]+\))+?/g
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, '')
      }

      /* delete move numbers */
      ms = ms.replace(/\d+\.(\.\.)?/g, '')

      /* delete ... indicating black to move */
      ms = ms.replace(/\.\.\./g, '')

      /* delete numeric annotation glyphs */
      ms = ms.replace(/\$\d+/g, '')

      /* trim and get array of moves */
      let moves = ms.trim().split(new RegExp(/\s+/))

      /* delete empty entries */
      moves = moves.join(',').replace(/,,+/g, ',').split(',')
      let move = ''

      let comment
      for (let half_move = 0; half_move < moves.length - 1; half_move++) {
        comment = decode_comment(moves[half_move])
        if (comment !== undefined) {
          this.comments[this.generate_fen()] = comment
          continue
        }
        move = this.move_from_san(moves[half_move], sloppy)

        /* move not possible! (don't clear the board to examine to show the
         * latest valid position)
         */
        if (move == null) {
          return false
        } else {
          this.make_move(move)
        }
      }

      comment = decode_comment(moves[moves.length - 1])
      if (comment !== undefined) {
        this.comments[this.generate_fen()] = comment
        moves.pop()
      }

      /* examine last move */
      move = moves[moves.length - 1]
      if (Chess.POSSIBLE_RESULTS.includes(move)) {
        if (has_keys(this._header) && typeof this._header.Result === 'undefined') {
          this.set_header(['Result', move])
        }
      } else {
        move = this.move_from_san(move, sloppy)
        if (move == null) {
          return false
        } else {
          this.make_move(move)
        }
      }
      return true
    }

    move (move, options) {
      /* The move function can be called with in the following parameters:
       *
       * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
       *
       * .move({ from: 'h7', <- where the 'move' is a move object (additional
       *         to :'h8',      fields are ignored)
       *         promotion: 'q',
       *      })
       */

      // allow the user to specify the sloppy move parser to work around over
      // disambiguation bugs in Fritz and Chessbase
      const sloppy = options?.sloppy ?? false

      let move_obj = null

      if (typeof move === 'string') {
        move_obj = this.move_from_san(move, sloppy)
      } else if (typeof move === 'object') {
        const moves = this.___generate_moves()

        /* convert the pretty move object to an ugly move object */
        for (let i = 0, len = moves.length; i < len; i++) {
          if (
            move.from === utils.algebraic(moves[i].from) &&
            move.to === utils.algebraic(moves[i].to) &&
            (!('promotion' in moves[i]) ||
              move.promotion === moves[i].promotion)
          ) {
            move_obj = moves[i]
            break
          }
        }
      }

      /* failed to find move */
      if (!move_obj) {
        return null
      }

      /* need to make a copy of move because we can't generate SAN after the
       * move is made
       */
      const pretty_move = this.make_pretty(move_obj)

      this.make_move(move_obj)

      return pretty_move
    }

    undo () {
      const move = this.undo_move()
      return move ? this.make_pretty(move) : null
    }

    square_color (square) {
      if (square in Chess.SQUARES) {
        const sq_0x88 = Chess.SQUARES[square]
        return (utils.rank(sq_0x88) + utils.file(sq_0x88)) & 1 ? 'dark' : 'light'
      }

      return null
    }

    history (options) {
      const reversed_history = []
      const move_history = []
      const verbose = options?.verbose ?? false

      while (this._history.length > 0) {
        reversed_history.push(this.undo_move())
      }

      while (reversed_history.length > 0) {
        const move = reversed_history.pop()
        if (verbose) {
          move_history.push(this.make_pretty(move))
        } else {
          move_history.push(this.move_to_san(move, this.___generate_legal_moves()))
        }
        this.make_move(move)
      }

      return move_history
    }

    get_comment () {
      return this.comments[this.generate_fen()]
    }

    set_comment (comment) {
      this.comments[this.generate_fen()] = comment.replace('{', '[').replace('}', ']')
    }

    delete_comment () {
      const comment = this.comments[this.generate_fen()]
      delete this.comments[this.generate_fen()]
      return comment
    }

    get_comments () {
      this.prune_comments()
      return Object.keys(this.comments).map(fen => {
        return { fen, comment: this.comments[fen] }
      })
    }

    delete_comments () {
      this.prune_comments()
      return Object.keys(this.comments).map(fen => {
        const comment = this.comments[fen]
        delete this.comments[fen]
        return { fen, comment }
      })
    }

   /*****************************************************************************
    * DEBUGGING UTILITIES
    ****************************************************************************/
   perft(depth=4) {
      const moves = this.___generate_pseudolegal_moves()
      const us = this.turn
      let nodes = 0

      for (const move of moves) {
         this.make_move(move)
         if (!this.king_attacked(us)) {
            if (depth - 1 > 0) {
               const child_nodes = this.perft(depth - 1)
               nodes += child_nodes
            } else {
               nodes++
            }
         }
         this.undo_move()
      }

      return nodes
   }

   divide(depth=4) {
      if (depth === 1) {
         return this.moves()
      }

      const moves = this.___generate_pseudolegal_moves()
      let divisions = new Map()
      let total_nodes = 0

      const us = this.turn
      for (const move of this.moves()) {
         this.move(move)
         const nodes = this.perft(depth - 1)
         divisions.set(move, nodes)
         total_nodes += nodes
         this.undo_move()
      }

      divisions.set("total", total_nodes)
      return divisions
   }
}
  
  /*****************************************************************************
   * UTILITY FUNCTIONS
   ****************************************************************************/
const utils = {
   nonZeroDigit: {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
   },

   oppositeColor: {
      [Chess.BLACK]: Chess.WHITE,
      [Chess.WHITE]: Chess.BLACK
   },

   rank(i) {
      return i >> 4
   },

   file(i) {
      return i & 15
   },

   algebraic(i) {
      return 'abcdefgh'[utils.file(i)] + '87654321'[utils.rank(i)]
   },
  
   algebraicFile(i) {
      return 'abcdefgh'[utils.file(i)]
   },

   algebraicRank(i) {
      return '87654321'[utils.rank(i)]
   },

   // deepcopies an object
   clone(obj) {
      const dupe = obj instanceof Array ? [] : {}

      for (const property in obj) {
         if (typeof obj[property] === 'object') {
            dupe[property] = utils.clone(obj[property])
         } else {
            dupe[property] = obj[property]
         }
      }

      return dupe
   }
}

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Chess = Chess
/* export Chess object for any RequireJS compatible environment */
if (typeof define !== 'undefined')
  define(function () {
    return Chess
  })

/* uncomment for es6+ module system */
// export default Chess
