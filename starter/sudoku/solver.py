"""Sudoku solving helpers."""

from __future__ import annotations

import random

from .constants import EMPTY, SIZE


def is_safe(board: list[list[int]], row: int, col: int, num: int) -> bool:
    """Return True when placing num at (row, col) is valid."""
    for x in range(SIZE):
        if board[row][x] == num or board[x][col] == num:
            return False

    start_row = row - row % 3
    start_col = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[start_row + i][start_col + j] == num:
                return False
    return True


def fill_board(board: list[list[int]]) -> bool:
    """Fill a Sudoku board recursively using backtracking."""
    for row in range(SIZE):
        for col in range(SIZE):
            if board[row][col] == EMPTY:
                possible = list(range(1, SIZE + 1))
                random.shuffle(possible)
                for candidate in possible:
                    if is_safe(board, row, col, candidate):
                        board[row][col] = candidate
                        if fill_board(board):
                            return True
                        board[row][col] = EMPTY
                return False
    return True


def count_solutions(board: list[list[int]], limit: int = 2) -> int:
    """Return the number of solutions for a Sudoku board up to the given limit."""
    working_board = [row[:] for row in board]
    count = 0

    def search() -> None:
        nonlocal count
        if count >= limit:
            return

        row = -1
        col = -1
        for r in range(SIZE):
            for c in range(SIZE):
                if working_board[r][c] == EMPTY:
                    row = r
                    col = c
                    break
            if row != -1:
                break

        if row == -1:
            count += 1
            return

        for value in range(1, SIZE + 1):
            if is_safe(working_board, row, col, value):
                working_board[row][col] = value
                search()
                working_board[row][col] = EMPTY
                if count >= limit:
                    return

    search()
    return count
