from flask import Flask, request, jsonify, render_template
from config import Config
from extensions import db
from models import User, Post, Comment
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def index():
    return render_template("index.html", current_page="main")

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(login=data['login']).first():
        return jsonify({"error": "Login already taken"}), 400

    user = User(
        login=data['login'],
        surname=data['surname'],
        name=data['name'],
        patronymic=data['patronymic'],
        year=data['year']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered", "user_id": user.id}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(login=data.get('login')).first()
    if user:
        return jsonify({"message": "Login successful", "user_id": user.id, "name": user.name}), 200
    return jsonify({"error": "User not found"}), 404
    

@app.route('/posts', methods=['POST'])
def create_post():
    data = request.json
    user = User.query.get(data.get('user_id'))
    if not user:
        return jsonify({"error": "User not found"}), 404

    post = Post(content=data.get('content'), user=user)
    db.session.add(post)
    db.session.commit()
    return jsonify({"message": "Post created", "post_id": post.id}), 201

@app.route('/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    data = request.json
    user = User.query.get(data.get('user_id'))
    post = Post.query.get(post_id)

    post.likes += 1
    db.session.commit()
    return jsonify({"message": f"User {user.id} liked post {post_id}"}), 200

@app.route('/comments', methods=['POST'])
def add_comment():
    data = request.json
    user = User.query.get(data.get('user_id'))
    post = Post.query.get(data.get('post_id'))

    if not post:
        return jsonify({"error": "Post not found"}), 404
    if not user:
        return jsonify({"error": "User not found"}), 404

    comment = Comment(text=data.get('text'), post=post, user=user)
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added", "comment_id": comment.id}), 200

if __name__ == '__main__':
    app.run(debug=True)