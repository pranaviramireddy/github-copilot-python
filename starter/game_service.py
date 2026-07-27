"""State management for the current Sudoku game."""

from __future__ import annotations

CURRENT_GAME: dict[str, list[list[int]] | int | None] = {
    "puzzle": None,
    "solution": None,
    "hint_count": 0,
}


def set_current_game(puzzle: list[list[int]], solution: list[list[int]]) -> None:
    """Store the active puzzle and solution for the current session."""
    CURRENT_GAME["puzzle"] = puzzle
    CURRENT_GAME["solution"] = solution
    CURRENT_GAME["hint_count"] = 0


def get_current_puzzle() -> list[list[int]] | None:
    """Return the currently active puzzle, if any."""
    return CURRENT_GAME["puzzle"]


def get_current_solution() -> list[list[int]] | None:
    """Return the currently active solution, if any."""
    return CURRENT_GAME["solution"]


def get_current_hint_count() -> int:
    """Return how many hints have been used for the current game."""
    return int(CURRENT_GAME["hint_count"])


def increment_hint_count() -> int:
    """Increase the hint counter and return the updated count."""
    CURRENT_GAME["hint_count"] = int(CURRENT_GAME["hint_count"]) + 1
    return int(CURRENT_GAME["hint_count"])
