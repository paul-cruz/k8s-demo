FROM python:3.9-slim

COPY . /app
WORKDIR /app

RUN python -m pip install --upgrade pip
RUN pip install -r requirements.txt
EXPOSE 5000

ENV API_ENV "PROD"
ENV PORT 5000

CMD ["python","app.py"]