"""Application factory for the Flask Sudoku app."""

from __future__ import annotations

from flask import Flask

from routes import bp


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.register_blueprint(bp)
    return app


app = create_app()
