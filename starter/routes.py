"""Flask routes for the Sudoku application."""

from __future__ import annotations

from flask import Blueprint, jsonify, render_template, request

from game_service import (
    get_current_hint_count,
    get_current_puzzle,
    get_current_solution,
    increment_hint_count,
    set_current_game,
)
from sudoku import SIZE, generate_puzzle, get_incorrect_cells

bp = Blueprint("main", __name__)


@bp.route("/")
def index() -> str:
    return render_template("index.html")


@bp.route("/new")
def new_game():
    difficulty = request.args.get("difficulty", "medium")
    clues_arg = request.args.get("clues")

    if clues_arg is not None:
        puzzle, solution = generate_puzzle(clues=int(clues_arg))
    else:
        puzzle, solution = generate_puzzle(difficulty=difficulty)

    set_current_game(puzzle, solution)
    return jsonify({"puzzle": puzzle})


@bp.route("/check", methods=["POST"])
def check_solution():
    data = request.get_json(silent=True) or {}
    board = data.get("board")
    solution = get_current_solution()

    if solution is None:
        return jsonify({"error": "No game in progress"}), 400

    if not isinstance(board, list) or len(board) != SIZE:
        return jsonify({"error": "Invalid board payload"}), 400

    incorrect = get_incorrect_cells(board, solution)
    solved = len(incorrect) == 0 and all(
        cell != 0 for row in board for cell in row
    )
    return jsonify({"incorrect": incorrect, "solved": solved})


@bp.route("/hint", methods=["POST"])
def get_hint():
    data = request.get_json(silent=True) or {}
    board = data.get("board")
    solution = get_current_solution()
    current_puzzle = get_current_puzzle()

    if solution is None or current_puzzle is None:
        return jsonify({"error": "No game in progress"}), 400

    if not isinstance(board, list) or len(board) != SIZE:
        return jsonify({"error": "Invalid board payload"}), 400

    for row in board:
        if not isinstance(row, list) or len(row) != SIZE:
            return jsonify({"error": "Invalid board payload"}), 400

    for row_index in range(SIZE):
        for col_index in range(SIZE):
            if board[row_index][col_index] == 0 and current_puzzle[row_index][col_index] == 0:
                board[row_index][col_index] = solution[row_index][col_index]
                hint_count = increment_hint_count()
                return jsonify(
                    {
                        "board": board,
                        "cell": {"row": row_index, "col": col_index},
                        "hint_count": hint_count,
                    }
                )

    return jsonify({"board": board, "hint_count": get_current_hint_count()})
