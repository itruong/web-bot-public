FROM python:3.7.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

CMD python ./scheduler.py
