import os
import subprocess


def run_project():
    os.putenv('WERKZEUG_RUN_MAIN', 'true')
    os.popen('conda activate WWWDataManagement && python backend/bot.py')
    os.popen('conda activate WWWDataManagement && python backend/app.py')
    subprocess.check_call('npm start --prefix frontend/', shell=True)


if __name__ == '__main__':
    run_project()
