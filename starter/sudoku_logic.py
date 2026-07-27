"""Compatibility wrapper for the refactored Sudoku logic package."""

from sudoku import (  # noqa: F401
    EMPTY,
    SIZE,
    create_empty_board,
    deep_copy,
    fill_board,
    generate_puzzle,
    get_incorrect_cells,
    is_safe,
    remove_cells,
)

