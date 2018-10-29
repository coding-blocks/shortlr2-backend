# API Spec 

## Constraints

### Data Size

1. Shortcode max string size = **8**
2. For groups, length of ({group id} + {short code}) = **8**
3. When creating if shortcode.length < 8, padLeft with 0s
4. Hard Limit from64(shortcode) -> number must be less than 2^53 (JS number limit)

### API Usage

- Creating random shortlinks
  - User must be authenticated (via account.codingblocks.com)
- Creating custom shortlinks
  - User must have role = employee / admin / intern 
  - _roles are available from userdata coming from oneauth_
- Creating groups
  - User must have role = admin / employee
- Edit Shortlink
  - User who created it, or role = admin
- Delete Shortlink
  - role = admin only
- Create private links
  - role = admin / employee
- View any non-private link
  - no auth needed
- View any private link
  - auth needed, but all roles allowed



## Endpoints 

### Authentication 
 Use `passport-oneauth` and `passport-http-bearer` 
 
#### `GET /login`
Use `passport.authenticate('oneauth')` which redirects to 
`https://account.codingblocks.com/oauth/authorize?client_id=xxxx&redirect_uri=xxx` 

#### `GET /login/callback?grant_code=xxxx` 
Use `passport.authenticate('oneauth')` which gives us `user` object. 
Store user, create a login token, send response - 

```
{
  'userId': 00,
  'auth_token': 'xxxx'
}
```

In future all requests need to have the same auth token in their headers

```
Authorization: Bearer xxxx
```

Use passport.authenticate('bearer') to authenticate all requests to auth-required routes.


### Short Codes

#### `POST /:shortcode` 

Data - 
```
longUrl: "https://samplewebsite.com"
```

#### `GET /:shortcode`

Redirect to - `https://samplewebsite.com` 

#### `POST /:group/:shortcode`

_NOTE: Create group if not exists_

```
longUrl: "https://samplewebsite2.com"
```

#### `GET /:group/:shortcode`

Redirect to - `https://samplewebsite2.com` 


