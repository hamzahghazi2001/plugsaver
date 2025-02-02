# tests/test_auth.py
import unittest
from app.auth import signup, login

class TestAuth(unittest.TestCase):

    def test_signup(self):
        result = signup("testuser2@example.com", "securePassword123", "testuser2")
        self.assertIsNotNone(result)
        self.assertEqual(result[0]['email'], "testuser2@example.com")

    def test_login(self):
        signup("testuser3@example.com", "securePassword123", "testuser3")
        result = login("testuser3@example.com", "securePassword123")
        self.assertIsNotNone(result)
        self.assertEqual(result['email'], "testuser3@example.com")

if __name__ == "__main__":
    unittest.main()
