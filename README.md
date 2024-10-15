# YelpCamp
This project makes use of:
- Node
- Express
- MongoDB
- Mongoose
- Bootstrap

## `/seeds/index.js`
Running this file with `node /seeds/index.js` will seed the database with sample data.

## Full CRUD functionality

### 'Show' route
```
GET /campgrounds/:id
```
takes you to ...


### 'Create' route
GET for the submission form:
```
GET /campgrounds/new
```
POST for the actual submission:
```
POST /campgrounds
```

### 'Update' route
GET for the update form:
```
GET /campgrounds/:id/edit
```
PUT for the actual edit submission:
```
PUT /campgrounds/:id
```

### 'Delete' route
DELETE for the deletion of some campground from the show page:
```
DELETE /campground/:id
```

## Bootstrap 5
- `views/layouts/boilerplater.ejs` is the HTML template containing the templatized HTML head, etc. for the entire application
- `views/partials/navbar.ejs` is the navbar HTML which is injected into the boilerplate template via `<%- include('../partials/navbar') %>`