# pbo-example-pwa
example project for module 'PBO'

Start
----------
First install the dependencies:

``
npm install
``

start the application

``
npm start
``

The appliation will be served on *localhost:8080*


Routes
----------
``/api/search/query``

search for a station by name. ``query`` is the search term.

``/api/plan/id``

get the current departure times for a specific station (identified by ``id``).
