import os
import subprocess
import backend.config as config


def run_project():
    os.putenv('WERKZEUG_RUN_MAIN', 'true')
    os.popen('conda activate WWWDataManagement && python backend/bot.py')
    os.popen('conda activate WWWDataManagement && python backend/app.py')
    with open("frontend/.env", 'w') as file:
        file.write(f"REACT_APP_API_URL=http://localhost:{config.port}\n")
        file.write(f"REACT_APP_SECRET={config.secret}\n")
    subprocess.check_call('npm start --prefix frontend/', shell=True)


if __name__ == '__main__':
    run_project()
