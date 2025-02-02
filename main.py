# main.py
from app.auth import signup, login, verify

'''def main():
    # Testing Signup
    email = "testuser@example.com"
    password = "securePassword123"
    username = "testuser"

    signup(email, password, username)

    # Testing Login
    login_email = "testuser@example.com"
    login_password = "securePassword123"
    login(login_email, login_password)

if __name__ == "__main__":
    main()'''

def test():
    verify("joseph.kariampally@gmail.com")
    print("Done")

test()