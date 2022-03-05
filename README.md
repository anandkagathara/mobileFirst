# __mobileFirst ReadMe File__ 


**Declaimer** 

> This project in userCan Signup based on username,password,qualification,city and phonenumber and after signUp user can logIn with username and password, user can not the upload the Image only admin can add the image in the account and user can only see this image in getHome page after the login.

<!-------------------------------------------------------------------------------------------------------------------------------------------->


**Version Related Information**

>I am worked in the postGreDatabase 11 and NodeJS version 14.18.0

<!-------------------------------------------------------------------------------------------------------------------------------------------->

**Database and Table creation Information**

>Postgre database in create only for one user_data name table and manage all the conditions in one table for the database simplicity and   fatching time take low.


***user_data table fields***
     
     -user_id
     -user_name
     -role (1=Normal User and 2=Admin)
     -password (encrypted using hashPassword)
     -qualification
     -city
     -phone_number
     -is_login (1=Login and 0=Logout user)
     -images
     -created_date (timestamp)
     -modified_date (timestamp)

<!----------------------------------------------------------------------------------------------------------------------------->

1. **Local PostGresDataBase Credenti:**

     > **host** : localhost
     > **username** : postgres
     > **password** : root

<!----------------------------------------------------------------------------------------------------------------------------->

2. **API's URL:**

 
    > **SignUp** : http://localhost:3009/users/signup
    > **SignIN** : http://localhost:3009/users/signin
    > **getHome** : http://localhost:3009/users/getHome
    > **uploadImage** : http://localhost:3009/admin/uplaodImage
    > **logOut** : http://localhost:3009/users/logOut


<!----------------------------------------------------------------------------------------------------------------------------->

3. **Postman Collection**

    >https://www.getpostman.com/collections/4e62a06c33c6e85fed18


<!----------------------------------------------------------------------------------------------------------------------------->

