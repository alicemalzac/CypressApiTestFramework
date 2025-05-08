FROM cypress/browsers:node-20.18.0-chrome-124.0.6367.201-1-ff-125.0.3-edge-124.0.2478.97-1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npx", "cypress", "run"]
