import os
from flask import Flask
from flask_cors import CORS
from apis import api


app = Flask(__name__)
api.init_app(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


app.run(debug=os.environ.get('DEBUG_MODE'), host='0.0.0.0')
