export interface IBlogItems {
    id: number
    userID: number
    publishedName: string
    date: string
    title: string
    description: string
    image: string
    tags: string
    categories: string
    isPublished: boolean
    isDeleted: boolean
}


// Getting our token for login

export interface IToken {
    token: string
}


// For Login and Create Account fetch

export interface IUserInfo {
    username: string
    password: string
}


// Getting our user's info: ID and Username

export interface IUserData {
    userId: number
    publisherName: string
}