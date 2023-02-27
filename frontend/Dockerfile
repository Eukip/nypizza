FROM node:14.16.0-alpine3.10 as builder
WORKDIR /app
COPY .  .
RUN npm install && npm run build

FROM nginx:1.19-alpine AS server
RUN rm /etc/nginx/conf.d/default.conf
COPY ./config/nginx/production/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
