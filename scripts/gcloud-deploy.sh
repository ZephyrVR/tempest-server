#! /bin/bash

# If on master and not a pull request, deploy to production
if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  gcloud compute ssh $GCLOUD_INSTANCE --zone $GCLOUD_ZONE -- "./deploy-prod.sh"
fi

# If on dev and not a pull request, deploy to dev
if [ "$TRAVIS_BRANCH" = "dev" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  gcloud compute ssh $GCLOUD_INSTANCE --zone $GCLOUD_ZONE "pwd"
fi