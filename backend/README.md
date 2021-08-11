# Backend service

This is the backend service that build by python3.5/Flask

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
1. Make sure you have python3.5 installed in your system, below example are based on Ubuntu14.04.

2. You need install virtualenv which provide support of python virtual environment.

```
sudo pip install virtualenv
```

3. Create your virtualenv for this project, the name myvenv can be customized.

```
virtualenv --python=/usr/bin/python3.5 myvenv
```

4. Activate your virtualenv, this step are needed for every time you start a new session(like after reboot or open a new terminal).

```
source myvenv/bin/activate
```

### Installing

5. Pull repo from github

```
git clone git@github.com:quyuetong/ShoppinSite.git
```

6. Install dependency python libraries, keep mind that your path may different if you didn't git pull from your ~/

```
pip install -r backend/requirements.txt
```

## Running app and tests

7. Starting the service

```
sudo python backend/app.py
```

You should see " * Running on http://0.0.0.0:80/ (Press CTRL+C to quit)"

### Testing your APIs

8. Now you can make request to the service. You can use command like curl to test if your APIs work.

```
curl -i -H "Accept: application/json" -X POST -d '{"username": "yuetong", "password": "1234566"}' http://127.0.0.1/login
```

## Dependency python libraries Documentation

* [mysql.connector](https://dev.mysql.com/doc/connector-python/en/) - The interface to enables Python programs to access MySQL databases.
* [Flask](http://flask.pocoo.org/) - A microframework for Python based on Werkzeug, Jinja 2 and good intentions.
