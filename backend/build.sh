#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

mkdir -p staticfiles

python manage.py collectstatic --no-input --clear
python manage.py migrate --no-input