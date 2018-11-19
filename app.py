from flask import Flask
from flask import render_template


"""Importing fetchCbioportal Utility - https://github.com/ataaillah/FetchCbioportal
import importlib, importlib.util, os.path
def module_from_file(module_name, file_path):
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module    
fetchCbioportal = module_from_file("getColumnOfFileInList", "./fetchCbioportal/filetools.py") 

#Importing CGAT Utility - https://github.com/CGATOxford/cgat/blob/master/CGAT/CBioPortal.py 
import importlib, importlib.util, os.path
def module_from_file(module_name, file_path):
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module    
fetchCbioportal = module_from_file("CBioPortal", "./cgat_app/CBioPortal.py") """

app = Flask(__name__)

# def homepage():
#     return """<h1>Hello world!</h1>"""
@app.route('/')
@app.route('/dsa_ui')
def dsaoncoprintjs_page():
    return render_template('index.html', tile='Home')

@app.errorhandler(500)
def page_not_found(e):
    return render_template('500.html'), 500

if __name__ == '__main__':
    app.run(debug=True)