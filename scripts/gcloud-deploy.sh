#! /bin/bash

# If on master and not a pull request, deploy to production
if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  gcloud compute ssh $GCLOUD_INSTANCE --zone $GCLOUD_ZONE --command "/var/www/deploy.sh"
fi

gcloud compute instances remove-metadata $GCLOUD_INSTANCE --zone $GCLOUD_ZONE --keys ssh-keys