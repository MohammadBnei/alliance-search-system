# Alliance-search-system

## Installation
It is advised to use docker :

Just run ```docker-compose up -d```

Then go to https://localhost

## FAQ

You may need to manually install dependancies into the docker containers, as it is still under developpement :

```docker-compose exec api-swapi sh -c 'npm i'```

```docker-compose exec api-user sh -c 'npm i'```

```docker-compose exec client sh -c 'yarn'```
