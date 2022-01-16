import os
import subprocess
import time
import backend.config as config


def run_project():
    os.putenv('WERKZEUG_RUN_MAIN', 'true')
    bot = None
    app = None
    npm = None
    try:
        bot = subprocess.Popen('conda activate WWWDataManagement && python backend/bot.py', shell=True)
        app = subprocess.Popen('conda activate WWWDataManagement && python backend/app.py', shell=True)
        with open("frontend/.env", 'w') as file:
            file.write(f"REACT_APP_API_URL=http://localhost:{config.port}\n")
            file.write(f"REACT_APP_SECRET={config.secret}\n")
        npm = subprocess.Popen(f'set PORT={config.react_port} && npm start --prefix frontend/', shell=True)
        while True:
            bot.poll()
            app.poll()
            npm.poll()
            time.sleep(10)

    except KeyboardInterrupt:
        bot.kill()
        app.kill()
        npm.kill()


if __name__ == '__main__':
    run_project()
