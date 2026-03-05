import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# --- 1. Начальная настройка ---
# Определяем путь к нашей базе данных
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
# Разрешаем запросы со всех источников (для простоты)
CORS(app) 

# Конфигурация базы данных SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- 2. Модель данных (структура таблицы в БД) ---
# Описываем, как будет выглядеть "листочек" в базе данных
class Leaf(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    color = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        """Функция для удобного преобразования в JSON"""
        return {"id": self.id, "name": self.name, "color": self.color}

# --- 3. API-эндпоинты (адреса, с которыми будет общаться фронтенд) ---

# Адрес для добавления нового листочка
@app.route('/api/add_leaf', methods=['POST'])
def add_leaf():
    # Получаем JSON-данные из запроса
    data = request.get_json()
    if not data or not 'name' in data or not 'color' in data:
        return jsonify({"error": "Missing data"}), 400

    # Создаем новый объект Leaf
    new_leaf = Leaf(name=data['name'], color=data['color'])
    
    # Добавляем его в сессию и сохраняем в БД
    db.session.add(new_leaf)
    db.session.commit()
    
    return jsonify({"message": "Leaf added!"}), 201

# Адрес для получения всех листочков
@app.route('/api/get_leaves', methods=['GET'])
def get_leaves():
    all_leaves = Leaf.query.all()
    # Преобразуем каждый листочек в словарь и отправляем списком
    return jsonify([leaf.to_dict() for leaf in all_leaves])

# === НОВЫЙ КОД ДЛЯ ОЧИСТКИ БАЗЫ ДАННЫХ ===
@app.route('/api/clear_database', methods=['GET'])
def clear_database():
    try:
        # Считаем, сколько было записей до удаления
        num_rows_deleted = db.session.query(Leaf).delete()
        # Сохраняем изменения в базе данных
        db.session.commit()
        return jsonify({"message": f"База данных успешно очищена. Удалено {num_rows_deleted} записей."}), 200
    except Exception as e:
        # В случае ошибки откатываем изменения
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# --- 4. Запуск приложения ---
if __name__ == '__main__':
    # Эта команда создает файл database.db, если его еще нет
    with app.app_context():
        db.create_all()
    # Запускаем сервер в режиме отладки
    app.run(debug=True, host='192.168.31.234', port=5000)

