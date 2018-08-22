# Marked Dependents

Stats on marked dependents.

## Usage

### update dependent information

Update dependent json files in [./packages](./packages)

NOTE: by default only new dependents not already in ./packages will be updated.
This happens so resuming after network error is possible.
If you want new information for current dependents in ./packages then just delete the packages directory before updating.

```sh
npm run update-packages
```

### update dependent information

Update stats from dependents in [./stats](./stats)

```sh
npm run update-stats
```

## current stats

#### [dlGt1000.json](./stats/dlGt1000.json):

A list of dependents that have greater than 1000 downloads per week.

#### [modThisYear.json](./stats/modThisYear.json):

A list of dependents that have been modified this year.

#### [releaseThisYear.json](./stats/releaseThisYear.json):

A list of dependents that have had a new release this year.

#### [versions.json](./stats/versions.json):

A list of marked versions used in package.json and number of dependents that use each version.
