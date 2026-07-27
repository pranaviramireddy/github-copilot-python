"""Sudoku puzzle generation helpers."""

from __future__ import annotations

import random

from .board import create_empty_board, deep_copy
from .constants import EMPTY, SIZE
from .solver import count_solutions, fill_board

DIFFICULTY_SETTINGS = {
    "easy": 40,
    "medium": 32,
    "hard": 24,
}


def remove_cells(board: list[list[int]], clues: int) -> None:
    """Remove cells from a solved board until the clue count is reached."""
    attempts = SIZE * SIZE - clues
    while attempts > 0:
        row = random.randrange(SIZE)
        col = random.randrange(SIZE)
        if board[row][col] != EMPTY:
            board[row][col] = EMPTY
            attempts -= 1


def generate_puzzle(
    clues: int | None = None,
    difficulty: str | None = None,
) -> tuple[list[list[int]], list[list[int]]]:
    """Generate a puzzle and its fully solved solution."""
    if clues is None:
        if difficulty is None:
            difficulty = "medium"
        difficulty_key = difficulty.lower()
        if difficulty_key not in DIFFICULTY_SETTINGS:
            raise ValueError(f"Unknown difficulty: {difficulty}")
        clues = DIFFICULTY_SETTINGS[difficulty_key]

    target_clues = clues
    target_empty_cells = SIZE * SIZE - target_clues

    for _ in range(100):
        board = create_empty_board()
        fill_board(board)
        solution = deep_copy(board)
        puzzle = deep_copy(board)
        coordinates = [(row, col) for row in range(SIZE) for col in range(SIZE)]
        random.shuffle(coordinates)

        removed_cells = 0
        for row, col in coordinates:
            if removed_cells >= target_empty_cells:
                break
            current_value = puzzle[row][col]
            if current_value == EMPTY:
                continue
            puzzle[row][col] = EMPTY
            if count_solutions(puzzle, limit=2) != 1:
                puzzle[row][col] = current_value
                continue
            removed_cells += 1

        if sum(cell != EMPTY for row in puzzle for cell in row) == target_clues:
            return puzzle, solution

    return puzzle, solution
