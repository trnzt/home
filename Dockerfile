ARG BUILDER_REGISTRY=codeberg.org
FROM $BUILDER_REGISTRY/thzinc/jekyll:0.1.1-ruby-3.3.9-ghp-232 AS build
WORKDIR /build

COPY Gemfile .
COPY Gemfile.lock .
RUN bundle install

COPY . .
RUN bundle exec jekyll build

FROM nginx:alpine3.22-slim AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/_site /usr/share/nginx/html