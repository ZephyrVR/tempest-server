#! /bin/bash
gcloud auth activate-service-account --key-file client-secret.json
ssh-keygen -f ~/.ssh/google_compute_engine -N ""