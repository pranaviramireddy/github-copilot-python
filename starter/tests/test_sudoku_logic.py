import sudoku_logic
from sudoku.solver import count_solutions


def test_create_empty_board_has_expected_dimensions():
    board = sudoku_logic.create_empty_board()

    assert len(board) == sudoku_logic.SIZE
    assert all(len(row) == sudoku_logic.SIZE for row in board)
    assert all(cell == sudoku_logic.EMPTY for row in board for cell in row)


def test_is_safe_rejects_conflicts_in_row_column_and_box():
    board = sudoku_logic.create_empty_board()
    board[0][0] = 1

    assert sudoku_logic.is_safe(board, 0, 1, 1) is False
    assert sudoku_logic.is_safe(board, 1, 0, 1) is False

    board[3][3] = 1
    assert sudoku_logic.is_safe(board, 4, 4, 1) is False
    assert sudoku_logic.is_safe(board, 4, 4, 2) is True


def test_generate_puzzle_returns_a_valid_board_pair():
    puzzle, solution = sudoku_logic.generate_puzzle(clues=40)

    assert len(puzzle) == sudoku_logic.SIZE
    assert len(solution) == sudoku_logic.SIZE
    assert all(len(row) == sudoku_logic.SIZE for row in (puzzle, solution))
    assert all(cell != sudoku_logic.EMPTY for cell in sum(solution, []))
    assert sum(cell == sudoku_logic.EMPTY for row in puzzle for cell in row) == 41


def test_generate_puzzle_with_difficulty_targets_expected_prefilled_counts_and_unique_solutions():
    for difficulty, expected_prefilled in (("easy", 40), ("medium", 32), ("hard", 24)):
        puzzle, solution = sudoku_logic.generate_puzzle(difficulty=difficulty)

        assert len(puzzle) == sudoku_logic.SIZE
        assert len(solution) == sudoku_logic.SIZE
        assert sum(cell != sudoku_logic.EMPTY for row in puzzle for cell in row) == expected_prefilled
        assert count_solutions(puzzle, limit=2) == 1


def test_get_incorrect_cells_returns_positions_with_mismatches():
    solution = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [4, 5, 6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4, 5, 6],
        [2, 3, 4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5, 6, 7],
        [3, 4, 5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6, 7, 8],
    ]
    board = [row[:] for row in solution]
    board[0][0] = 9

    assert sudoku_logic.get_incorrect_cells(board, solution) == [[0, 0]]
