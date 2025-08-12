FROM nginx:alpine3.22-slim AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY _site /usr/share/nginx/html