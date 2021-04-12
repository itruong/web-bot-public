# Selenium Bots Visualizer

The idea for this project was to create a platform for users to create and program bots tailored to their specific needs. In later stages, the goal was to provide a Selenium screen recording browser plugin that would enable no-code bot programming.

To drive the browsers, I decided to use Selenium, which is well-supported and easy to use. In particular, headful Selenium was used since users needed a way to add manual input to the system. The first major challenge was then how to share this desktop across the network to the user. I found the solution to this in Guacamole, a remote desktop gateway. The Guacamole service I implemented ended up using a modified piece of the official Guacamole web app that used Java/Tomcat that would establish a connection to the Selenium node desktop using VNC and a provided ip address. This data was then streamed to the frontend via a websocket connection and any user input would be sent back to the server.

The second major challenge became how to scale the infrastructure to enable nodes to be created and stopped on-demand. I attempted to accomplish this with Kubernetes to manage standalone containers, which worked as a proof of concept. However, there are still questions that haven’t been addressed including how to properly manage the connections, what complications may arise when moving to a cloud provider, and what hardware considerations were needed.

The rest of the application included a backend service in Python/Flask that handled routing and managing connections, like tracking a connection’s state, status, and owner. Additionally, the React frontend displayed a user’s connections as well as detailed connection information and the live desktop of an individual Selenium session.

Ultimately, the project was sunsetted because I realized that the product, while potentially useful in the end, could be too costly and had too many issues related to infrastructure, bot prevention measures, and competition against existing products.

## Setup and Installation

To run backend services with Docker Compose:
- ensure that a MONGO_CONNECTION connection string is specified in ```development.env``` 
- run ```docker-compose --env-file development.env up --build``` bring up the backend services

To run backend services with Kubernetes Minikube:
- with minikube running, configure your enviroment to use minikube's docker daemon by running ```eval $(minikube docker-env)```
- build each service with tags corresponding to the definitions in ```kubernetes.yml```
- set up the MONGO_CONNECTION connection string in ```kubernetes.yml``` (this would become part of a secrets config in future iterations)
- start the services using ```kubectl apply -f kubernetes.yml```

To run the frontend:
- run ```npm start``` in the web-frontend directory to start the frontend

## Technologies Used
- React.js
- Java/Tomcat/Guacamole
- Selenium
- Nginx
- MongoDB/Pymongo
- Python/Flask
