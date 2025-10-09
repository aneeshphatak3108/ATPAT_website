class Admins:
    def __init__(self, name, email, mis_id, tests_registered, role, hashed_password):
        self.name = name
        self.email = email
        self.mis_id = mis_id
        self.tests_registered = tests_registered
        self.roles = roles
        self.hashed_password = hashed_password