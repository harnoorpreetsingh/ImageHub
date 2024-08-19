// import exp from "constants"


// Importing necessary modules
import DataUriParser from "datauri/parser.js"; // Import DataUriParser for converting file data to Data URI
import path from "path"; // Import path module for handling file paths

// Function to get Data URL from file
const getDataURL = (file) => { // Accept file as a parameter
    const parser = new DataUriParser(); // Create a new instance of DataUriParser

    // Get the file extension name
    const extName = path.extname(file.originalname).toString();
    
    // Format the file data to Data URI
    return parser.format(extName, file.buffer);
}

export default getDataURL; // Export the function as default
