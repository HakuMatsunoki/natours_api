export enum Messages {
  invalidAuth = "Invalid login or password..",
  invalidToken = "You are not logged in! Please log in to get access..",
  expiredToken = "Token has expired..",
  noUser = "This user does no longer exist..",
  noName = "User must have a name..",
  noEmail = "User must have an email..",
  noPasswd = "User must have a password..",
  noPasswdConfirmation = "User must confirm a password..",
  differentPasswds = "Passwords are not the same..",
  invalidEmail = "Please provide a valid email..",
  invalidPasswd = "Password must be at least 8 characters long, contains symbols, numbers and capital letters..",
  invalidData = "Please, send only valid data..",
  duplicatedAccount = "This account already exist..",
  userCreated = "Account successfully created..",
  noDocument = "No document found with that id..",
  duplicatedItem = "Item already added..",
  notAllowed = "You do not have permission to perform this action..",
  tokenSent = "Token sent to email..",
  errorMail = "There was an error sending email. Please, try again later..",
  largeFile = "File is too large.."
}

export enum Codes {
  ok = 200,
  created = 201,
  noContent = 204,

  badRequest = 400,
  unauthorized = 401,
  notAllowed = 403,
  notFound = 404,
  conflict = 409,

  internal = 500
}
