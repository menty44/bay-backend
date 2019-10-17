# hBAY

###  Install NVM
    -sudo apt-get update
    -sudo apt-get install build-essential libssl-dev
    -curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
    -nano install_nvm.sh
    -bash install_nvm.sh
    -source ~/.profile
    -nvm ls -remote
    -nvm install 8.15.0
    -nvm use 8.15.0

###  Install Node Packages
    -npm install

###  Run tests using NPM
    npm tests

###  Linting made with eslint
    eslint filename i.e eslint test.js

### Logging made with chalk package 
    i.e log(chalk.blue('Server is running'));

###  Run coverage using instanbul
    istanbul cover test.js

###  install mongodb    
    install mongodb for your system

### Run the application to test the endpoints
    install nodemon server i.r npm install -g nodemon
    run it by issuing the following command i.r nodemon server
    
### Public endpoints
    POST http://localhost:3000/users/register -data  { username: "menty", password: "menty44" }
    POST http://localhost:3000/users/authenticate -data  { username: "menty", password: "menty44" }


### Private endpoints
    GET http://localhost:3000/api/profiles
    POST http://localhost:3000/api/patch -data { title: "menty", message: "menty44" }

### Dockerhub url for the dockerized application
    https://cloud.docker.com/repository/docker/menty44/node_api  
      
### Pull the container from the hub
    docker pull menty44/node_api
    
### Check the images to see if cloning was successful
    docker images
    
### Run the docker image
    docker run -p 49160:8080 -d menty44/node_api i.e it should be running on http://localhost:8080 
    
### If you need to go inside the container you can use the exec command
    docker exec -it <container id> /bin/bash i.e the app should be under this path /usr/src/app
    
     





