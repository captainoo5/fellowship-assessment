# T-World Mini API: Learning + Profiles

A backend REST API supporting mobile clients for the T-World application. Built using Node.js, Express, and MongoDB.

---

## Database Schema Summary

The database uses MongoDB with the following collections and rules:

### 1. `users`
Represents user profiles.
- `name`: String, required, unique.
- `email`: String, required, unique, matched on valid email formatting.
- `password`: String, required (hashed using bcrypt).
- **Index**: Unique compound index automatically created for `email` and `name` properties to optimize queries and enforce uniqueness.

### 2. `items`
Represents the available educational content or items.
- `title`: String, required, unique.
- `description`: String, required.
- `category`: String, required.
- `image`: String, required (URI).
- `price`: Number, required (must be positive).
- **Index**: Custom index created on the `category` field (`ItemSchema.index({ category: 1 })`) to support fast query filtering.

### 3. `saved_items` (Mongoose collection name: `saveditems`)
Tracks saved learning items associated with user profiles.
- `user`: ObjectId, referencing `User` model, required.
- `item`: ObjectId, referencing `Item` model, required.

---

## Environment Variables Configuration

To run the project, create a `.env` file in the root directory based on the following variables:

```env
# Port the server will run on
PORT=3000

# Connection URI to MongoDB Atlas database (remember to URL-encode credentials if they contain special characters)
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tworld?retryWrites=true&w=majority

# Secret key used for signing JSON Web Tokens (JWT)
JWT_SECRET=supersecretkey123
```

A template file is available in the repository as `.env.example`.

---

## How to Run Locally

### Prerequisites
- Node.js installed (v18+ recommended, tested with v22.16.0)
- npm package manager
- Running MongoDB Atlas Cluster or local MongoDB instance

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd backend-assessment
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory.
   - Insert and update your configurations as shown in [Environment Variables Configuration](#environment-variables-configuration).

4. **Run Server in Development Mode** (Runs with `nodemon` for auto-restarting on changes)
   ```bash
   npm run dev
   ```

5. **Run Integration Tests**
   - Ensure the server is running on the configured port.
   - Run the test suite:
     ```bash
     npm test
     ```

---

## API Documentation & Examples

All requests contain `Content-Type: application/json` headers when executing POST or DELETE requests.

### Authentication Endpoints

#### Register User
- **URL**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (Status `201 Created`):
  ```json
  {
    "id": "6a0ee1c7039a5080b8795567",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
  }
  ```

#### Login User
- **URL**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (Status `200 OK`):
  ```json
  {
    "id": "6a0ee1c7039a5080b8795567",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC..."
  }
  ```

---

### Learning Items Endpoints

#### Create a New Item
- **URL**: `POST /api/items`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "title": "Introduction to AI",
    "description": "Learn the fundamentals of Artificial Intelligence.",
    "category": "Technology",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "price": 49.99
  }
  ```
- **Response** (Status `201 Created`):
  ```json
  {
    "item": {
      "_id": "6a0ee1c9039a5080b8795568",
      "title": "Introduction to AI",
      "description": "Learn the fundamentals of Artificial Intelligence.",
      "category": "Technology",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "price": 49.99,
      "createdAt": "2026-05-21T10:43:21.454Z",
      "updatedAt": "2026-05-21T10:43:21.454Z"
    }
  }
  ```

#### Get All Items (Supports Pagination & Category Filter)
- **URL**: `GET /api/items`
- **Query Parameters**:
  - `page` (optional): Page number (defaults to `1`)
  - `limit` (optional): Number of records per page (defaults to `10`)
  - `category` (optional): Filter items by a specific category
- **Example**: `GET /api/items?page=1&limit=5&category=Technology`
- **Response** (Status `200 OK`):
  ```json
  {
    "items": [
      {
        "_id": "6a0ee1c9039a5080b8795568",
        "title": "Introduction to AI",
        "description": "Learn the fundamentals of Artificial Intelligence.",
        "category": "Technology",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        "price": 49.99
      }
    ]
  }
  ```

#### Get Item by ID
- **URL**: `GET /api/items/:id`
- **Response** (Status `200 OK`):
  ```json
  {
    "item": {
      "_id": "6a0ee1c9039a5080b8795568",
      "title": "Introduction to AI",
      "description": "Learn the fundamentals of Artificial Intelligence.",
      "category": "Technology",
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "price": 49.99
    }
  }
  ```

#### Delete Item
- **URL**: `DELETE /api/items/:id`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response** (Status `200 OK`):
  ```json
  {
    "message": "Item deleted successfully"
  }
  ```

---

### Saved Items Endpoints

#### Save an Item (Add to Profile)
- **URL**: `POST /api/items/:id/save`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response** (Status `201 Created`):
  ```json
  {
    "savedItem": {
      "user": "6a0ee1c7039a5080b8795567",
      "item": "6a0ee1c9039a5080b8795568",
      "_id": "6a0ee1ca039a5080b8795569",
      "createdAt": "2026-05-21T10:43:22.915Z",
      "updatedAt": "2026-05-21T10:43:22.915Z"
    }
  }
  ```

#### Get User's Saved Items
- **URL**: `GET /api/me/saved`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response** (Status `200 OK`):
  ```json
  {
    "savedItems": [
      {
        "_id": "6a0ee1ca039a5080b8795569",
        "user": "6a0ee1c7039a5080b8795567",
        "item": {
          "_id": "6a0ee1c9039a5080b8795568",
          "title": "Introduction to AI",
          "description": "Learn the fundamentals of Artificial Intelligence.",
          "category": "Technology",
          "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          "price": 49.99
        },
        "createdAt": "2026-05-21T10:43:22.915Z",
        "updatedAt": "2026-05-21T10:43:22.915Z"
      }
    ]
  }
  ```

#### Unsave an Item (Remove from Profile)
- **URL**: `DELETE /api/items/:id/save`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Response** (Status `200 OK`):
  ```json
  {
    "message": "Saved item deleted successfully"
  }
  ```
