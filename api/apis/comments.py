from flask_restx import Namespace, Resource, fields
from core import db_client

api = Namespace('Comments', description='Comments related operations')

comment_model = api.model('Comment', {
    'user': fields.String(required=True, description='Username'),
    'text': fields.String(required=True, description='Actual comment'),
})

comments_col = db_client.collection(u'comments')


@api.route('')
class Comments(Resource):
    @api.doc('add_comment')
    @api.expect(
        comment_model
    )
    def post(self):
        new_comment = api.payload
        print(new_comment)
        comments_col.add(new_comment)
        return "Added"

    @api.doc('list_comments')
    @api.marshal_list_with(comment_model)
    def get(self):
        docs = comments_col.stream()
        return [doc.to_dict() for doc in docs]
