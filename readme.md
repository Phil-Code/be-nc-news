# nc-news api

nc-news is a web api built using node.js, postgres and psql, hosted via elephantSQL and Render. The api serves a relational database containing articles, comments and users. 

# url to a working example of the api

https://nc-news-qqh3.onrender.com/api

# features

articles can be filtered by topic
articles can be sorted
comments can be filtered by article
articles display a dynamic count of the number of comments associated with them
users can post, patch and delete comments

# installation

to install nc-news:

clone the code from GitHub - https://github.com/Phil-Code/be-nc-news

At the top level of your newly cloned repository please create two .env files with the following contents to control your local node environment:

**filename**: .env.test
**file contents**: PGDATABASE=nc_news_test

**filename**: .env.development
**file contents**: PGDATABASE=nc_news

Then, in the terminal run the following to install the required dependencies and seed the database:
npm install 
npm setup-dbs
npm run seed

# required versions

Node.js v20.3.1
psql v14.9

# testing

In order to run tests please install jest and jest sorted as development dependencies:

npm install -D jest
npm install -D jest-sorted

npm run test 
