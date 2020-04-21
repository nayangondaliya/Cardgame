# assignment5
Card Game Assignment

#Project Setup Detail
Note: UI and backend projects are different. So, please make sure both project are running and first start the backend project.

*****************************************************************
For Backend API (CardGame-Api) project following are the pre-requisites.

Note: You must have node installed in your computer. If not please follow below instructions.

1. Download latest version of node and install in your computer.
2. Go inside project directoy where Package.json file is available.
3. Open command prompt and type below command in order to install required modules.
	npm install
4. After successfull execution of above command enter below command for running the project;
	node server.js
5. Now your server is running on port 3000.
*****************************************************************

*****************************************************************
For UI project (CardGame-UI) following are the pre-requisites.

Note: You must have the angular CLI and node installed in your computer. If not please follow below instructions.

Installation Process:
1. Download latest version of node and install in your computer.
2. Install angular CLI using below command
	npm install –g @angular/cli
3. Go inside project directoy where Package.json file is available.
4. Open command prompt and type below command in order to install required modules
	npm install
5. After successfull execution of above command enter below command in order to run the project
	ng serve --port 8081
6. It must be running on port 8081 because there is CORS policy applied on server side. If you run it on other port, server will not allow to process the request.
7. After successfull execution of step 5 open your web browser and enter below URL.
	http://localhost:8081
8. You will be redirect on login page default.
*****************************************************************