from flask_restx import Namespace, Resource, fields
from core import db_client
from google.cloud import firestore

api = Namespace('Reactions', description='Reactions related operations')

reaction_model = api.model('Reaction', {
    'reaction': fields.String(required=True, description='Reaction description'),
    'count': fields.Integer(required=True, description='Reaction counter'),
})

reactions_col = db_client.collection(u'reactions')


@api.route('')
class Reactions(Resource):

    @api.doc('list_reactions')
    @api.marshal_list_with(reaction_model)
    def get(self):
        docs = reactions_col.stream()
        response = []
        for doc in docs:
            aux = {'reaction': doc.id.replace('_reaction', '')}
            merged = dict(**aux, **doc.to_dict())
            response.append(merged)
        return response


@api.route('/love')
class ReactionLove(Resource):
    @api.doc('add_love')
    def put(self):
        love_doc_ref = reactions_col.document('love_reaction')
        love_doc = love_doc_ref.get()
        if not love_doc.exists:
            love_doc_ref.set(
                {"count": firestore.Increment(0)})
        love_doc_ref.update({"count": firestore.Increment(1)})
        return "Loved"


@api.route('/haha')
class ReactionHaha(Resource):
    @api.doc('add_haha')
    def put(self):
        haha_doc_ref = reactions_col.document('haha_reaction')
        haha_doc = haha_doc_ref.get()
        if not haha_doc.exists:
            haha_doc_ref.set(
                {"count": firestore.Increment(0)})
        haha_doc_ref.update({"count": firestore.Increment(1)})
        return "Hahad"


@api.route('/like')
class ReactionLike(Resource):
    @api.doc('add_like')
    def put(self):
        like_doc_ref = reactions_col.document('like_reaction')
        like_doc = like_doc_ref.get()
        if not like_doc.exists:
            like_doc_ref.set(
                {"count": firestore.Increment(0)})
        like_doc_ref.update({"count": firestore.Increment(1)})
        return "Liked"
