FROM python:3.10-alpine

WORKDIR /usr/src/app

COPY Pipfile* ./

RUN pip install pipenv && pipenv install --ignore --ignore-pipfile

COPY . .

CMD ["python", "main.py"]