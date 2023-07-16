# contains functions/examples needed to implement in aws server/db

import hashlib


def sha1_hash(text):
    sha1_hash = hashlib.sha1()
    sha1_hash.update(text.encode('utf-8'))

    return sha1_hash.hexdigest()


userToPwd = {}

user = 'test_user_name'
pwd = 'test_password'

# store hashed user and pwd
userToPwd[user] = sha1_hash(pwd)

print(userToPwd)


def authenticateUser(user, pwdAttempt):
    if not user in userToPwd.keys():
        return "Invalid username"
    elif not userToPwd[user] == sha1_hash(pwdAttempt):
        return "Invalid password"
    else:
        return "Access granted"


# Invalid username error
print(authenticateUser('InvalidUser', pwd))

# Invalid password error
print(authenticateUser(user, 'InvalidPassword'))

# Access granted
print(authenticateUser(user, pwd))

