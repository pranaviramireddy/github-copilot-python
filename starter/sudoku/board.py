"""Board helper functions for Sudoku."""

from __future__ import annotations

import copy

from .constants import EMPTY, SIZE


def deep_copy(board: list[list[int]]) -> list[list[int]]:
    """Return a deep copy of a board."""
    return copy.deepcopy(board)


def create_empty_board() -> list[list[int]]:
    """Create a blank Sudoku board filled with empty cells."""
    return [[EMPTY for _ in range(SIZE)] for _ in range(SIZE)]
