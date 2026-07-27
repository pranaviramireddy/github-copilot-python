"""Validation helpers for Sudoku boards."""

from __future__ import annotations


def get_incorrect_cells(board: list[list[int]], solution: list[list[int]]) -> list[list[int]]:
    """Return the coordinates of cells whose values differ from the solution."""
    incorrect_cells: list[list[int]] = []
    for row_index in range(len(board)):
        for col_index in range(len(board[row_index])):
            if board[row_index][col_index] != solution[row_index][col_index]:
                incorrect_cells.append([row_index, col_index])
    return incorrect_cells
