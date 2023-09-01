const Strings = {
  user: {
    created_success: 'The user has been created successfully',
    created_error: 'The user cannot be created',
    email_already_exist: 'The user with this email already exist',
    create_user_database_error: 'Unable to store the user in database',
    login_success:"The user was successfully logged in",
    login_failure:"The user cannot be logged in",
    validate_failed:"The password is invalid",
    token_failure:"The token could not be generated",
    invalid_email:"The email address is invalid"

  },
  book:{

    created_success: 'The book has been created successfully',
    created_error: 'The book cannot be created',
    title_already_exist: 'The book with this title already exist',
    create_book_database_error: 'Unable to store the book in database',
    find_many_success:"The books have been found successfully",
    find_many_error:"The books cannot be found",
    find_many_database_error:"Unable to find books in the database"

  },

  order:{
    
    created_success:"The order has been created successfully",
    created_failure:"The order cannot be created",
    created_failure_database:"Unable to insert order into the database",
    insufficient_funds:"You have insufficient funds to place this order",
    payment_success:"The points have been successfully debited",
    payment_failure:"The points payment was rejected",
    cancel_success:"The order was canceled successfully and your points are refuned",
    cancel_failure:"The order was not able to canceled",
    cancel_database_failure:"Unable to update the status of order in database",
    order_already_canceled:"The order was already canceled",
    points_credited_error:"The points were not credited",
    unauthorized_order_access:"You are not allowed to access this order"

  }
} as const;
export default Strings;
