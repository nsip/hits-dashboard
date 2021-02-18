var path = require('path');

/* nsip/hits-dashboard
 */
module.exports = {
  baseurl: "http://hitstest.dev.nsip.edu.au",
    // baseurl: "https://hits.nsip.edu.au",

    // XXX This is in package.json and hits.json?
  "version": "2.0.2",  // See CHANGELOG.md

  // XXX Isn't this hits.json
    project_versions: {
      sif_data: 1,
      // Deprecated - see package.json hits_dashboard: "2.0.2",
      sif_server: 1
  },

  // XXX Add a single dummy login and move these out of there
"auth": {
    "scott": { "password": "testpw", "email": "scottp@dd.com.au" },
  },

  /*
  // Production DB
  "database": {
    driver: 'mysql',
    host: 'db.dev.nsip.edu.au',
    database: 'hits',
    user: 'hitsadmin',
    password: 'foxcrowbaker'
  },

  // Production create
  "create": {
    base: "http://hits.nsip.edu.au/dbcreate",
  },
  */

  // XXX Docker - move this to a local host (backend only), no auth
  "database": {
    driver: 'mysql',
    host: 'db',
    database: 'hits',
    user: 'hits',
    password: 'hits4nias'
  },

  // XXX Docker - How to know what real base URL is?
  create: {
    // base: "http://hitstest.dev.nsip.edu.au/dbcreate",
    base: "http://sif-data.local/dbcreate",
  },

  // Docker - base for usecases
  usecases: {
    base: "http://usecases:3000/",
    // (local testing) base: "http://localhost:3001/",
  },

  // XXX Docker - SSL?

  mailgun: {
    apiKey: 'key-df32edce350d1ce87c630dfe40f39d2f',
    domain: 'hits.nsip.edu.au',
  },

  "log": {
    "output": "logs",
    "exitOnError": true,
    "level": "info"
  },

    "nsip": {
        "projects": [
            'a',
            'b',
        ],
    },


    database_current_version: 2,

    // Warnings and errors are shown for every version greater than the current version
    database_version_messages: {
        1: [
            {   type: 'warn',
                message: "This is a warning version 1"
            },
            {   type: 'error',
                message: "This is a error on version 1"
            }
        ],
        2: [
            {
                type: 'error',
                message: "This is an error version 2"
            }
        ]
    },

    //TODO - Should these have a acronym value? Currently I'm setting the value
    // and display value as the string below in the select drop down
    project_list : [
        'SIF AU Attendance Working Group',
        'ASL Australian Schools List',
        'DSR-ACT',
        'DSR-NSW',
        'DSR-NT',
        'DSR-QLD',
        'DSR-SA',
        'DSR-TAS',
        'DSR-VIC',
        'DSR-WA',
        'DSWG - Data Standards Working Group',
        'DSWG Sub Group  - Timetable Daily Variations',
        'ICON - Catholic Education Melbourne',
        'INSWP Integrating NSW',
        'NAPLAN Online National Assessment Platform',
        'Privacy Framework',
        'SA HITS Assurance',
        'SIF Implementation Specification',
        'VEDU - Vic eduHub',
        'NT SIF 3 pilot',
        'WA SIF 3 Hub'
    ],


  xsp: {
    test: {
      title: "Test it",
      path: "/Users/scottp/nsip/hits-dashboard/data",
    },
    SchoolData: {
      title: "Naplan Results SchoolDataa",
      // path: "/Users/xyz/nsip/hits-dashboard/data/SchoolData",
      path: path.resolve(__dirname + "/../../data/SchoolData"),
    },
    TestData: {
      title: "Naplan Results SchoolDataa",
      path: path.resolve(__dirname + "/../../data/TestData"),
    },
    SchoolList: {
      title: "Naplan Results SchoolDataa",
      path: path.resolve(__dirname + "/../../data/SchoolList"),
    },
  },

  // Example NAPLAN Passwords - NEVER to be used in production
  naplanresults: {
    users: {
      ABC: "XYZ",

      vicgov: "nnn6WWgqVoHh",
      qldgov: "EPhEBaxz2tfp",
      tasgov: "osi7VwpyswDi",
      ntgov: "LYU8NLwqCdks",
      actgov: "9PfbBWdZLNbp",
      wagov: "V4fDzybyDpYU",
      nswgov: "TNfmUgH8Qoys",

      viccath: "ycXjFNwf9aFy",
      qldcath: "rYQissZTE3bk",
      tascath: "yhLiz6YEcpKa",
      ntcath: "HonyGV9cWgxm",
      actcath: "anttKfQeXqV9",
      wacath: "jfUFWGqGq3oG",
      nswcath: "hfwckxx9meVe",

      vicind: "R6wsGvNQGCod",
      qldind: "3eRzQAUJPpZX",
      tasind: "bMHExvYTu3je",
      ntind: "hCQkBHMzE6xq",
      actind: "baAmGwiGPT3F",
      waind: "3TLRNyLGcetz",
      nswind: "XyYP6YVtacpE",

    },
  },

};
