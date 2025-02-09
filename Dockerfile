# Use an official Node.js runtime as a parent image
FROM node:20
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install app dependencies
RUN npm install
RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY 5h47l9ueb4abboi
ENV PM2_SECRET_KEY zc26czc9hmvk3cr

# Bundle app source
COPY . .
# Expose the port your app runs on
EXPOSE 5050
# Define the command to run your app
CMD ["pm2-runtime", "start", "index.js", "--name", "Bookapp"]