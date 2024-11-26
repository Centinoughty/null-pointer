# NULL-POINTER
A simple file upload service built with Node.js, Express, and Multer. This service allows users to upload files to a server and retrieves a publicly accessible URL for each uploaded file.

## Features
  - Upload files with a maximum size of 256 MB.
  - Automatically generates unique filenames for uploaded files.
  - Stores files in a designated `uploads` directory.
  - Returns a URL for the uploaded file.
  - Supports basic expiration logic (to be implemented).

## Technologies Used  
  - **Node.js**: JavaScript runtime for building server-side applications.
  - **Express**: Fast web framework for Node.js.
  - **Multer**: Middleware for handling multipart/form-data, primarily used for file uploads.
  - **UUID**: Library for generating unique identifiers for files.

## Installation
  1. Clone the repository:
    ```bash   git clone https://github.com/Centinoughty/null-pointer.git   ```

  3. Navigate to the project directory:
    ```bash   cd null-pointer   ```

  5. Install the dependencies:
    ```bash   npm install   ```

  7. Start the server:
    ```bash   npm start   ``` 
