#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"

# 로그 파일 생성 및 권한 설정
if [ ! -f "$LOG_FILE" ]; then
  touch "$LOG_FILE"
  chmod 666 "$LOG_FILE"
fi

echo "====== START: stop_server.sh ======" >> $LOG_FILE
echo "$(date): Stopping existing application..." >> $LOG_FILE

# 포트 확인 및 프로세스 종료
PORT=3000
if netstat -tuln | grep -q ":$PORT"; then
  echo "$(date): Stopping any process running on port $PORT..." >> $LOG_FILE
  fuser -k $PORT/tcp >> $LOG_FILE 2>&1

  if [ $? -eq 0 ]; then
    echo "$(date): Successfully stopped the application on port $PORT." >> $LOG_FILE
  else
    echo "$(date): Failed to stop the application on port $PORT." >> $LOG_FILE
    exit 1
  fi
else
  echo "$(date): No application running on port $PORT. Nothing to stop." >> $LOG_FILE
fi

echo "====== END: stop_server.sh ======" >> $LOG_FILE
exit 0
