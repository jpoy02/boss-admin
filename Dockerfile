# Use the latest LTS Node version
FROM node:24-alpine

# Install the Quasar CLI globally
RUN yarn global add @quasar/cli

# Set the working directory
WORKDIR /src

# Expose the development port
EXPOSE 9000

# The command is handled by docker-compose for better flexibility


