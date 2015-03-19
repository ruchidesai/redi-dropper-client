
from flask import session
from flask import redirect
from flask import render_template

#from flask.ext.login import login_required

from redidropper import app

def is_loggedin():
    return 'user' in session



@app.route('/')
def index():
    details = get_user_details([
        'username',
        'fullname',
        'email',
        'department',
        'personid'
    ])
    loggedin = is_loggedin()
    if loggedin:
        print "user is logged in"
    else:
        print "not logged in... show login button"

    return render_template("login.html", loggedin=loggedin, details=details)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user')
    return redirect('/')

# This page is visible when user is not logged in
@app.route('/about1')
def about1():
    return render_template('about1.html')

# This page is visible when user is not logged in
@app.route('/contact1')
def contact1():
    return render_template('contact1.html')

# This page is visible when user is logged in
@app.route('/about')
def about():
    return render_template('about.html')

# This page is visible when user is logged in
@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/uploaderhome')
def uploaderhome():
    return render_template('uploaderhome.html')

@app.route('/dashboard')
#@login_required
def show_dashboard():
    if "user" in session:
        return "Welcome {name}".format(name=session["user"]["nickname"])
    return redirect(app.config["SSO_LOGIN_URL"])
    #return render_template("dashboard.html")


def get_user_details(fields):
    if 'user' not in session:
        return ""
    defs = [
        '<dt>{0}</dt><dd>{1}</dd>'.format(f, get_user_session_info(f))
        for f in fields
    ]
    return '<dl>{0}</dl>'.format(''.join(defs))
