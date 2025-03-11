#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"
SERVER_LOG="/home/ec2-user/server.log"
DEPLOY_DIR="/home/ec2-user/Trendy_Front"
NODE_VERSION="22"
PORT=3000

echo "====== START: start_server.sh ======" >> "$LOG_FILE"
echo "$(date): Starting Next.js application..." >> "$LOG_FILE"

# ✅ NVM 초기화
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# ✅ Node.js 버전 설정
echo "$(date): Ensuring Node.js version $NODE_VERSION is used..." >> "$LOG_FILE"
nvm install $NODE_VERSION >> "$LOG_FILE" 2>&1
nvm use $NODE_VERSION >> "$LOG_FILE" 2>&1
if [ $? -ne 0 ]; then
  echo "$(date): Failed to use Node.js version $NODE_VERSION. Exiting." >> "$LOG_FILE"
  exit 1
fi

# ✅ 배포 디렉터리 이동
cd "$DEPLOY_DIR" || {
  echo "$(date): Failed to change directory to $DEPLOY_DIR. Exiting." >> "$LOG_FILE"
  exit 1
}

echo "$(date): Current working directory: $(pwd)" >> "$LOG_FILE"

# ✅ `.next/` 폴더가 없으면 빌드 실행
if [ ! -d ".next" ]; then
  echo "$(date): .next directory missing. Running npm run build..." >> "$LOG_FILE"
  npm run build >> "$LOG_FILE" 2>&1
fi

# ✅ 애플리케이션 실행
echo "$(date): Starting application with npm run start..." >> "$LOG_FILE"
nohup npm run start >> "$SERVER_LOG" 2>&1 &

APP_PID=$!
echo "$(date): Application started with PID $APP_PID. Verifying..." >> "$LOG_FILE"

# ✅ 애플리케이션 상태 확인
for i in {1..10}; do
  if curl -s "http://localhost:$PORT" > /dev/null; then
    echo "$(date): Application successfully started on port $PORT with PID $APP_PID." >> "$LOG_FILE"
    echo "====== END: start_server.sh ======" >> "$LOG_FILE"
    exit 0
  fi
  echo "$(date): Application not yet started. Retrying... ($i/10)" >> "$LOG_FILE"
  sleep 3
done

echo "$(date): ERROR: Application failed to start. Check $SERVER_LOG for details." >> "$LOG_FILE"
exit 1
