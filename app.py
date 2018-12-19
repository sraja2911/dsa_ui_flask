from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
@app.route('/dsa_ui')
def dsawebixjs_page():
    return render_template('index.html', tile='Home')

@app.errorhandler(500)
def page_not_found(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True)