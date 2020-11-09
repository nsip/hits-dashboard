Final stages of hand over to Peter:
* Database - Probably abort moving it and use existing
* sif-data - Just check it still works
* That should then be complete.
* HITS-Report
* HITS-Client
* Nginx config & short and long term URL

Notes and stuff TODO

* Copy front page
* Recovery system - Email me URLs



Docker(ize)
* Location of Usecases, Client, and SIF-Data
  - Could proxy it
    - e.g. Have a single nginx doing the proxy to backend
    - Can then also do the SSL
* Development vs Production
  - Things will change other than just versions
  - e.g. way logging is done, restart: always
  - Mahybe this is an example of two docker-compose?
*
