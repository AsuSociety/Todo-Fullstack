
class User:
    """A sample User class"""

    def __init__(self, name, password):
        self.name = name
        self.password = password

    def __repr__(self):
        return "Employee('{}', '{}')".format(self.name, self.password)