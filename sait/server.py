from flask import Flask, redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
from extensions import db
import models
app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)
@app.route("/")
def index():
    return render_template("index.html", current_page="main")
def main():
    app.run("0.0.0.0", port=5000, debug=True)
if __name__ == "__main__":
    main()
@app.route('/books')
def books():
    books = models.Book.query.all()
    return render_template('books.html', books=books)
@app.route('/books/add', methods=['POST'])
def add_book():
    if request.method == 'POST':
        book = models.Book(
            title=request.form['title'],
            author=request.form['author'],
            year=request.form['year']
        )
        db.session.add(book)
        db.session.commit()
        return redirect(url_for('books'))