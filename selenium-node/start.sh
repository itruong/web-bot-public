#!/usr/bin/env bash

/opt/bin/entry_point.sh &
flask init-db
flask run --host=0.0.0.0

