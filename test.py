from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_start_page(self):
        with self.client as client:
            res = self.client.get('/')

            self.assertEqual(res.status_code, 200)
            self.assertIn('board', session)
            self.assertIs(session.get('high_score', 0), 0)
            self.assertIs(session.get('play_count', 0), 0)
            self.assertIn(b'id="guess-form"', res.data)

    def test_check_valid_word(self):
        with self.client as client:
            with client.session_transaction() as session:
                session['board'] = [
                    ['L', 'Z', 'M', 'Q', 'S'],
                    ['R', 'H', 'A', 'U', 'I'],
                    ['G', 'I', 'R', 'I', 'R'],
                    ['F', 'R', 'T', 'T', 'G'],
                    ['U', 'J', 'X', 'E', 'G']
                ]

        test_list = {
            'get': 'ok',
            'fire': 'not-on-board',
            'asdsfdg': 'not-word'
        }

        for (test, value) in test_list.items():
            res = self.client.post('/check-guess', json={'guess': test})
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json.get('result'), value)
