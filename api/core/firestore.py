import os
from google.oauth2 import service_account
from google.cloud import firestore

credentials = service_account.Credentials.from_service_account_file(
    os.environ.get("GOOGLE_FIRESTORE_SA"))

project_id = os.environ.get("GCP_PROJECT_ID")

db_client = firestore.Client(project=project_id, credentials=credentials)
