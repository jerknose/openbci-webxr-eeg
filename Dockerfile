# --- Stage 1 --- Install dependencies and build

FROM node:8

# Copies everything over to Docker environment
COPY . /usr/src/app/

# Switch to work directory
WORKDIR /usr/src/app

# Install all node packages
RUN yarn install

# # Build project
RUN yarn run build

# Run file server
CMD ["npm", "run", "file"]