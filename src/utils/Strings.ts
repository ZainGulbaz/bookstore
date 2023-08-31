const Strings = {
  user: {
    created_success: 'The user has been created successfully',
    created_error: 'The user cannot be created',
    email_already_exist: 'The user with this email already exist',
    create_user_database_error: 'Unable to store the user in database',
  },
  book:{

    created_success: 'The book has been created successfully',
    created_error: 'The book cannot be created',
    title_already_exist: 'The book with this title already exist',
    create_book_database_error: 'Unable to store the book in database',
    find_many_success:"The books have been found successfully",
    find_many_error:"The books cannot be found",
    find_many_database_error:"Unable to find books in the database"

  }
} as const;
export default Strings;
