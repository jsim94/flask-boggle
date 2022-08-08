from flask import Flask, session, jsonify, redirect, request, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

boggle_game = Boggle()

BOARD = 'board'
HIGH_SCORE = 'high_score'
PLAY_COUNT = 'play_count'

app = Flask(__name__)
app.debug = True

app.config['SECRET_KEY'] = "secretz"
debug = DebugToolbarExtension()


@app.route('/')
def start_game():
    board = boggle_game.make_board()
    session[BOARD] = board
    high_score = session.get(HIGH_SCORE, 0)
    return render_template("game_board.html", high_score=high_score)


@app.route('/check-guess', methods=['POST'])
def check_guess():
    '''
    Takes users guess and returns the status of the guess, 'ok', 'not-on-board', or 'not-word'
    '''
    word = request.json.get('guess')
    result = boggle_game.check_valid_word(session[BOARD], word)

    return jsonify({'result': result})


def update_current_count(play_count):
    current_count = play_count
    current_count += 1
    return current_count


def is_new_score(user_score, high_score):
    if user_score > high_score:
        high_score = user_score
    print(high_score)
    return high_score


@app.route("/submit-score", methods=['POST'])
def submit_score():
    '''
    Handles game completion and decides if user's score is a new highscore. If there is a new highscore, update flask session with new high scrore.

    Also updates user PLAY_COUNT on each completion.
    '''
    user_score = request.json.get('score')
    current_high_score = session.get(HIGH_SCORE, 0)

    session[PLAY_COUNT] = update_current_count(session.get(PLAY_COUNT, 0))
    session[HIGH_SCORE] = is_new_score(user_score, current_high_score)
    return jsonify({'highScore': session[HIGH_SCORE], 'playCount': session[PLAY_COUNT]})
