docker compose run --rm build && \
docker compose build web && \
docker tag wealthsim-web us-west1-docker.pkg.dev/nullism/nullism/wealthsim-web:latest && \
docker push us-west1-docker.pkg.dev/nullism/nullism/wealthsim-web:latest