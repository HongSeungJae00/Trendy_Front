#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"
echo "====== START: cleanup_logs.sh ======" >> "$LOG_FILE"
echo "$(date): Cleaning up old logs..." >> "$LOG_FILE"

# 로그 파일 경로
SERVER_LOG="/home/ec2-user/server.log"
DEPLOYMENT_LOG="/home/ec2-user/deployment.log"

# 기존 로그 파일 삭제
for FILE in "$SERVER_LOG" "$DEPLOYMENT_LOG"; do
  if [ -f "$FILE" ]; then
    echo "$(date): Deleting log file $FILE..." >> "$LOG_FILE"
    sudo rm -f "$FILE"
  fi
done

# 새로운 로그 파일 생성
sudo touch "$SERVER_LOG" "$DEPLOYMENT_LOG"
sudo chmod 666 "$SERVER_LOG" "$DEPLOYMENT_LOG"
sudo chown ec2-user:ec2-user "$SERVER_LOG" "$DEPLOYMENT_LOG"

echo "$(date): New log files initialized." >> "$LOG_FILE"

# 디스크 상태 확인
echo "$(date): Disk space after log cleanup:" >> "$LOG_FILE"
df -h >> "$LOG_FILE"

echo "====== END: cleanup_logs.sh ======" >> "$LOG_FILE"
exit 0
