FROM node:24-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000
# Define the command to run your app
CMD [ "npm", "start" ]