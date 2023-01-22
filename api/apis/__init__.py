from flask_restx import Api

from .comments import api as ns_comments
from .reactions import api as ns_reactions

api = Api(
    title='API demo for K8s implementation',
    version='1.0',
    description='Quick implementation to track reactions and comments',
    prefix='/api'
)

api.add_namespace(ns_comments, path='/comments')
api.add_namespace(ns_reactions, path='/reactions')
