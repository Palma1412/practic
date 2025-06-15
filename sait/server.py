from flask import Flask, request, jsonify, render_template, redirect, url_for
from config import Config
from extensions import db
from models import User, Post, Comment
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/profile")
def profile_page():
    return render_template("profile.html") 

@app.route("/")
def index():
    return render_template("register.html")

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        if User.query.filter_by(login=data.get('login')).first():
            return jsonify({"error": "Login already taken"}), 400

        user = User(
            login=data.get('login'),
            surname=data.get('surname'),
            name=data.get('name'),
            patronymic=data.get('patronymic'),
            year=data.get('year')
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({
            "message": "User registered",
            "user_id": user.id,
            "redirect": url_for('login_page')  # 👈 ИСПРАВЛЕНО
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["GET"])
def login_page():
    return render_template("signup.html")  # 👈 шаблон логина

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    login = data.get("login")

    if not login:
        return jsonify({"error": "Login required"}), 400

    user = User.query.filter_by(login=login).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "login": user.login,
            "surname": user.surname,
            "name": user.name,
            "patronymic": user.patronymic,
            "year": user.year
        },
        "redirect": url_for("profile_page")
    }), 200

@app.route('/users/<int:user_id>/posts', methods=['GET'])
def get_user_posts(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    posts = [
        {
            "id": post.id,
            "content": post.content,
            "likes": post.likes,
            "comments": [
                {
                    "id": comment.id,
                    "text": comment.text,
                    "author": comment.user.login
                } for comment in post.comments
            ]
        } for post in user.posts
    ]
    return jsonify({"posts": posts}), 200

@app.route('/posts', methods=['POST'])
def create_post():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        user_id = data.get('user_id')
        content = data.get('content')

        if not user_id or not content:
            return jsonify({"error": "Missing user_id or content"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        post = Post(content=content, user_id=user_id)

        db.session.add(post)
        db.session.commit()

        return jsonify({"message": "Post created", "post_id": post.id}), 201
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/posts/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    data = request.json
    user = User.query.get(data.get('user_id'))
    post = Post.query.get(post_id)

    if not user or not post:
        return jsonify({"error": "Invalid user or post"}), 404

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
