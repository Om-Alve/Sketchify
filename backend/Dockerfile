FROM node:lts-alpine

USER node
WORKDIR /home/node

COPY . .
RUN npm ci

ARG PORT
EXPOSE ${PORT:-8000}

CMD ["npm", "run", "start"]
