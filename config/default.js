var path = require('path');

/* nsip/hits-dashboard
 */
module.exports = {
  baseurl: "http://hitstest.dev.nsip.edu.au",
    // baseurl: "https://hits.nsip.edu.au",
  "version": "2.0.2",  // See CHANGELOG.md
    project_versions: {
      sif_data: 1,
      // Deprecated - see package.json hits_dashboard: "2.0.2",
      sif_server: 1
  },

"auth": {
    "scott": { "password": "NoneShallNSIP", "email": "scottp@dd.com.au" },
    "peter": { "password": "NoneShallNSIP", "email": "peter.haydon@nsip.edu.au" },
    "matt": { "password": "NoneShallNSIP", "email": "matt.farmer@nsip.edu.au" },
    "nick": { "password": "NoneShallNSIP", "email": "nick.nicholas@nsip.edu.au" },
    "linda": { "password": "NoneShallNSIP", "email": "linda.marshall@nsip.edu.au" },
    "raf": { "password": "NoneShallNSIP", "email": "rafidzal.rafiq@systemic.com.au" },
    "joerg": { "password": "NoneShallNSIP", "email": "joerg.huber@gmail.com" },
    "georgina": { "password": "NoneShallNSIP", "email": "Georgina.Johnston@nsip.edu.au" },
    "fran": { "password": "NoneShallNSIP", "email": "nashiralyana@gmail.com" },
    "lyn": { "password": "NoneShallNSIP", "email": "Lynette.Pecchiar@nsip.edu.au"},
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

  // Test DB
  "database": {
    driver: 'mysql',
    host: 'testdb.dev.nsip.edu.au',
    database: 'hits',
    user: 'hitstest',
    password: 'foxcrowbaker'
  },
  // Test Create
  "create": {
    base: "http://hitstest.dev.nsip.edu.au/dbcreate",
  },

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

  // NOTE: Any new notificatino must have a LARGER id than the last one here
  notifications: [
    {
      id: 1,
      title: "This is first trial notificaiton",
      body: "Stuff about it",
    },
  ],

};
