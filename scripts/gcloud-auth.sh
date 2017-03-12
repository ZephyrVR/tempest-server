#! /bin/bash
gcloud auth activate-service-account --key-file client-secret.json
gcloud config set project $GCLOUD_PROJECT
ssh-keygen -q -N "" -f ~/.ssh/google_compute_engine