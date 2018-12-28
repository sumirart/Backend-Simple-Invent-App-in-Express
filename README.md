# Backend-Simple-Invent-App-in-Express
Express backend of my simple invent app in RN, made with express and mongodb (mongodb atlas).

Front end: https://github.com/sumirart/FrontEnd-Simple-Invent-App-in-RN

## Installation
1. Clone project
```
git clone https://github.com/sumirart/Backend-Simple-Invent-App-in-Express.git
```

2. cd into folder
```
cd backend-simple-invent-app-in-express
```

3. Download dependencies
```
npm install
```

4. Change file 'nodemon.json' to your mongo atlas password, server, and JWT key
```
"MONGO_ATLAS_PW": "changehere",
"MONGO_ATLAS_SERVER": "changehere",
"JWT_KEY": "changehere"
```

5. Start with nodemon
```
nodemon server.js
```
