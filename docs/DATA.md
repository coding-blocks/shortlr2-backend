# Data

## Format

### Shortcode to code int relationship

 - code ids are integers (max 2^53 - 1 due to Javascript)
 - short code is base 64 (alphabet = [0-9][a-z][A-Z], _, -)
 - conversion is handled by `convert-radix64` module
 - if `codeStr.length < 8` then pad 0s to the right
 - if prefix/code format then `codeId = from64({prefixId}{code})`

## Configuration

- PostgreSQL


## Tables

### Users

| column          | type   | description                                            |
|-----------------|--------|--------------------------------------------------------|
| id (PRIMARYKEY) | int    | user id (as received from oneauth)                     |
| role            | string | as comes from oneauth, but we can have more of our own |

### URLs

| column            | type   | description                              |
|-------------------|--------|------------------------------------------|
| code (PRIMARYKEY) | int    | codeStr converted from base64 to integer |
| codeStr           | string | short code in base64                     |
| codeActual        | string | code as user sees (w/o pad 0 and with /) |
| longUrl           | string | original URL to redirect to              |
| hits              | int    | no of hits                               |
| private           | bool   | if can be accessed without login or not  |

### AuthTokens

| column | type       | description               |
|--------|------------|---------------------------|
| token  | string(64) | random uid for each login |
| userId | int        | references user.id        |

### Events

| column          | type   | description                           |
|-----------------|--------|---------------------------------------|
| id (PRIMARYKEY) | int    | autoincrement                         |
| code            | int    | references url.code                   |
| fromIP          | string | IP of client system                   |
| fromURL         | string | req.referrer (if available)           |
| userId          | int    | references user.id (if authenticated) |


### Groups
| column         | type   | description                                   |
|----------------|--------|-----------------------------------------------|
| id(PRIMARYKEY) | int    | autoincrement                                 |
| prefix         | string | prefix of group (before /)                    |
| ownerId        | int    | references user.id (person who created group) |
