FROM python:3.9.7
WORKDIR /src

RUN apt update && apt install -y postgresql-client && pip install --upgrade pip
RUN apt-get update && apt-get install -y gettext
COPY src/requirements.txt .
RUN pip install -r requirements.txt
COPY . .

RUN pip install gunicorn
# CMD will run when this dockerfile is running
CMD ["sh", "-c", "python manage.py collectstatic --no-input; \
                  python manage.py migrate; \
                  gunicorn NewYork.wsgi -b 0.0.0.0:8000"]
