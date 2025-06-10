from extensions import db
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(100), nullable=False)
    surname = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    patronymic = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer)
    is_available = db.Column(db.Boolean, default=True)
    def __repr__(self):
        return f'<User {self.title}>'
class Post(db.Model):
    __tablename__='post'
    id = db.Column(db.Integer, primary_key=True)
       