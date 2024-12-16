# Step 1: Use the official Node.js image from Docker Hub as a base image
FROM node:22.11.0

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Set environment variables (you can add as many as you need)
ENV EMAIL="sequityofficial@gmail.com"
ENV EMAIL_PASSWORD="vbtm eddm xure vyhv"
ENV JWT_SECRET="sequityofficial"

# Step 7: Expose the port that the app will run on
EXPOSE 3000

# Step 8: Define the command to run your application
CMD ["npm", "start"]
