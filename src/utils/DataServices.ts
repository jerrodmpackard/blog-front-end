import { IBlogItems, IToken, IUserData, IUserInfo } from "@/Interfaces/Interfaces"


// const url = "https://myblogapi.azurewebsites.net";
const url = "http://localhost:5039";

let userData: IUserData;


// creating an async function for login. we have to pass in an object, so we pass in an argument of createdUser (we just made this variable up) and gave it a type of IUserInfo, the interface we just created for logging in. It contains an object with parameters of username and password
// This will be a post, since we need to add data to our database with this "fetch". To do this, we add a comma after our url, and we create an object that contains 3 properties: method, headers, and body. Recall that we set this up in our CORS policy with allowAnyMethod, allowAnyHeader, etc.

export const createAccount = async (createdUser: IUserInfo) => {
    // We are using this fetch to make a POST request
    // We have to se tthe method to POST
    // We set the content type to application/JSON to specify our JSON data format

    const promise = await fetch(url + "/User/AddUser", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(createdUser)
    });

    // We need to check if our post was successful

    if (!promise.ok) {
        const message = "An error has occured " + promise.status;
        throw new Error(message);
    }

    const data = await promise.json();
    console.log(data);
}

// Now we make our login fetch. Once again, we must pass in an object, so we create the loginUser variable and give it a type of IUserInfo

export const login = async (loginUser: IUserInfo) => {
    const promise = await fetch(url + '/User/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginUser)
    });

    if (!promise.ok) {
        const message = 'An error has occured ' + promise.status;
        throw new Error(message);
    }

    // When we login, we receive a token as a response. So we setup our data with a type of IToken in order to receive that data properly. We then return data to get that token response from our function

    const data: IToken = await promise.json();
    return data;
}

// 

export const getLoggedInUserData = async (username: string) => {
    const promise = await fetch(url + '/User/GetUserByUsername/' + username);
    const data = await promise.json();
    userData = data;
}

// Next, we create the userData variable at the top and give it a type of IUserData
// Now we make a few helper functions. One to make our data more accessible to our components in the dashboard and blog page

export const loggedInData = () => {
    return userData;
}

// Another helper function to check if our user is logged in
// We have a boolean and we're checking local storage for a key of Token. If local storage data is not null, we set the boolean value to true. We then return the boolean value at the end. True means logged in, false means logged out.

export const checkToken = () => {
    let result = false;

    let lsData = localStorage.getItem('Token');

    if (lsData != null) {
        result = true;
    }

    return result;
}


// Dashboard Fetches to get blog data

export const getBlogItemsByUserID = async (userID: number) => {
    const promise = await fetch(url + '/Blog/GetItemsByUserId/' + userID);
    const data = await promise.json();
    return data;
}

export const addBlogItem = async (blog: IBlogItems) => {
    const promise = await fetch(url + '/Blog/AddBlogItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    });

    if (!promise.ok) {
        const message = 'An Error has occurred ' + promise.status;
        throw new Error(message);
    }

    const data = await promise.json();

    // Why are we returning data? This is because we are returning a boolean value depending on whether or not we successfully added a new blog item. If the addition of the blog item was successful, returns true. Else, returns false. We want this information
    return data;
}

// Adding an endpoint to updateBlogItem. This is the same code as adding a new blog item, we just update the function name and the URL for the fetch

export const updateBlogItem = async (blog: IBlogItems) => {
    const promise = await fetch(url + '/Blog/UpdateBlogItem', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
    });

    if (!promise.ok) {
        const message = 'An Error has occurred ' + promise.status;
        throw new Error(message);
    }

    const data = await promise.json();

    // Why are we returning data? This is because we are returning a boolean value depending on whether or not we successfully added a new blog item. If the addition of the blog item was successful, returns true. Else, returns false. We want this information
    return data;
}

export const getAllBlogItems = async () => {
    const promise = await fetch(url + '/Blog/GetAllBlogItems');
    const data = await promise.json();
    return data;
}