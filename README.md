# Wrestlers API

This api will allow the users of our react front-end application to CRUD Wrestlers and their championship reigns.

This application uses token authentication instead of sessions.

## Resources

### Wrestlers

##### Routes Table

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| GET   | `/wrestlers`             | `wrestlers#index`    |
| GET   | `/wrestlers/:id`             | `wrestlers#show`    |
| POST  | `/wrestlers`               | `wrestlers#create`  |
| PATCH | `/wrestlers/:id`        | `wrestlers#update`   |
| DELETE | `/wrestlers/:id`        | `wrestlers#delete`   |


### Users

##### Routes Table

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/sign-up`             | `users#signup`    |
| POST   | `/sign-in`             | `users#signin`    |
| PATCH  | `/change-password/` | `users#changepw`  |
| DELETE | `/sign-out/`        | `users#signout`   |

### Championship Reigns

##### Routes Table

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST  | `/titles/:wrestlerId`               | `titles#create`  |
| PATCH | `/titles/:wrestlerId/:titleId`        | `titles#update`   |
| DELETE | `/titles/:wrestlerId/:titleId`        | `titles#delete`   |