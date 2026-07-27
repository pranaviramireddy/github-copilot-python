# Sudoku Game – Refactored with GitHub Copilot

## Overview

This project is a modernized version of the legacy Flask Sudoku application provided by Udacity. The application was refactored using GitHub Copilot to improve code quality, modularity, and maintainability while adding several new gameplay features.

## Features

- ✅ Modern modular Flask application structure
- ✅ Sudoku puzzle generator with a unique solution
- ✅ Difficulty levels:
  - Easy
  - Medium
  - Hard
- ✅ Timer that tracks puzzle completion time
- ✅ Hint button that fills one correct cell and locks it
- ✅ Check Puzzle button to highlight incorrect entries
- ✅ Immediate feedback for invalid moves
- ✅ Congratulations message when the puzzle is solved
- ✅ Top 10 leaderboard
  - Player name
  - Completion time
  - Difficulty level
  - Hints used
- ✅ Leaderboard stored using browser Local Storage
- ✅ Dark Mode support
- ✅ Responsive design for desktop and mobile
- ✅ Alternating colors for each 3×3 Sudoku block
- ✅ Unit tests using pytest

---

# Project Structure

```
starter/
│
├── app.py
├── app_factory.py
├── game_service.py
├── routes.py
├── generator.py
├── solver.py
├── validator.py
├── board.py
├── constants.py
├── templates/
├── static/
├── tests/
├── Screenshots/
├── instruction.md
└── README.md
```

---

# Installation

Clone your repository

```bash
git clone <your-github-repository-url>
cd github-copilot-python/starter
```

Create a virtual environment

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

# Run the Application

```bash
python app.py
```

Open your browser and visit

```
http://127.0.0.1:5000
```

---

# Run Tests

```bash
pytest
```

---

# GitHub Copilot Usage

GitHub Copilot was used throughout the project to:

- Refactor the legacy Flask application
- Create a modular project structure
- Improve Sudoku generation logic
- Ensure puzzles have a unique solution
- Add difficulty levels
- Implement the timer
- Add Hint and Check Puzzle functionality
- Implement the Top 10 leaderboard
- Add Dark Mode
- Improve responsive UI
- Generate and improve unit tests

All Copilot conversations required for the project are included in the **Screenshots** folder.

---

# Screenshots

The **Screenshots** folder contains evidence of GitHub Copilot usage for:

- Testing framework setup
- Refactoring
- Unique solution validation
- Difficulty selector
- Timer
- Hint feature
- Check Puzzle feature
- Leaderboard implementation
- Dark Mode
- Responsive styling
- Completion message

---

# Technologies Used

- Python 3
- Flask
- HTML5
- CSS3
- JavaScript
- Pytest
- GitHub Copilot

---

# Author

**Ramireddy Pranavi**

Computer Science Undergraduate

Andhra University College of Engineering

2026 Graduate