from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__, static_folder='static')

CORS(app)

# Database configuration
db = mysql.connector.connect(
    host='localhost',
    user='faizan',
    password='951236874',
    database='recipes_db'
)
cursor = db.cursor()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    try:
        title = request.form['title']
        ingredients = request.form['ingredients']
        instructions = request.form['instructions']
        image = request.files['image']

        # Save the image file
        filename = image.filename
        image.save(os.path.join('static/images', filename))

        # Insert recipe data into the database
        query = "INSERT INTO recipes (title, ingredients, instructions, image) VALUES (%s, %s, %s, %s)"
        values = (title, ingredients, instructions, filename)
        cursor.execute(query, values)
        db.commit()

        # Get the inserted recipe
        recipe_id = cursor.lastrowid
        query = "SELECT * FROM recipes WHERE id = %s"
        cursor.execute(query, (recipe_id,))
        recipe = cursor.fetchone()

        return jsonify({'success': True, 'recipe': recipe})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/delete_recipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    try:
        # Get the recipe image filename
        query = "SELECT image FROM recipes WHERE id = %s"
        cursor.execute(query, (recipe_id,))
        filename = cursor.fetchone()[0]

        # Delete the recipe from the database
        query = "DELETE FROM recipes WHERE id = %s"
        cursor.execute(query, (recipe_id,))
        db.commit()

        # Delete the recipe image file
        os.remove(os.path.join('static/images', filename))

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/get_recipes')
def get_recipes():
    try:
        # Retrieve all recipes from the database
        query = "SELECT * FROM recipes"
        cursor.execute(query)
        recipes = cursor.fetchall()

        return jsonify({'success': True, 'recipes': recipes})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/edit_recipe/<int:recipe_id>', methods=['GET', 'PUT'])
def edit_recipe(recipe_id):
    if request.method == 'GET':
        try:
            # Get the recipe details
            query = "SELECT * FROM recipes WHERE id = %s"
            cursor.execute(query, (recipe_id,))
            recipe = cursor.fetchone()

            return render_template('edit_recipe.html', recipe=recipe)
        except Exception as e:
            return str(e)
    elif request.method == 'PUT':
        try:
            # Get the recipe details from the request
            title = request.form['title']
            ingredients = request.form['ingredients']
            instructions = request.form['instructions']
            image = request.files['image']

            # Save the image file
            filename = image.filename
            image.save(os.path.join('static/images', filename))

            # Update the recipe in the database
            query = "UPDATE recipes SET title = %s, ingredients = %s, instructions = %s, image = %s WHERE id = %s"
            values = (title, ingredients, instructions, filename, recipe_id)
            cursor.execute(query, values)
            db.commit()

            return jsonify({'success': True})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
