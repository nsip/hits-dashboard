Dashboard API Code

# Upgrade Notes

## 2.12 - December 2020

* curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
* sudo apt-get install nodejs npm
* sudo apt-get update; sudo apt-get upgrade
* remove "node_modules" and "npm install" 



# Autoamtic Running

* sudo npm install forever -g
* sudo npm install forever-service -g
* cd ~/hits-dashboard
* sudo forever-service install hits-dashboard -s bin/www -r ubuntu
* sudo service hits-dashboard start

# Database

* hits - Central database
	* account - List and entries of accounts
	* database - List of databases for each account
* ABC-123 - A database for SIF

# Paths

## Useras

* POST /login
	* Send username, password
	* Set session cookie
* GET /logout
	* Delete session cookie

## Recover

* POST /recover/
	* Send Email
	* Returns success
	* Emails the user their list of account URLs

## Admin

Admin access, to create and manage accounts. Requires authentication.

* GET /admin/
* POST /admin/
	* Include name and email
* GET /admin/:id (can request id, email or name, substring match)
	* Return name and email for id
* PUT /admin/:id
	* Update name/email for id

## Account

Account is used to manage and create a database. Requires account key.

* GET /account/:accountId
	* Get name, email for id
* GET /account/:accountId/database
	* Get list of databaseses
* POST /account/:accountId/database
	* Create new Database
	* Include name, and create options (see use case)
* GET /account/:accountId/database/:databaseId
	* Get Database Details

## Dashboard

Access single database details, including view of tables. Requires database id

* GET /dashboard/:databaseId
* GET /dashboard/:databaseId/table
	* Return a list of tables
* GET /dashbaord/:databaseId/table/:tableId
	* Return rows in table (max 1000)


# User Interface 

## Admin 

* Login & Logout (login.html, logout.html)
* Table list of Accounts (admin.html)
* Form for creating new accounts (admin.html)
* Page for editing an existing account (admin.html)

## Account 

* View account details (account.html)
* List Databases (database.html)
* Create Database (2 stages - Name & Data) (create.html)

## Dashboard 

* Replication of old dashboard (dashboard.html)

## Older Ubuntu Work arounds

* https://wellingguzman.com/notes/upgrading-nodejs-npm-on-ubuntu-14-04
* sudo npm install -g npm
