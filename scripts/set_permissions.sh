#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"
APP_DIR="/home/ec2-user/Trendy_Front"

# 기존 로그 파일 삭제
if [ -f "$LOG_FILE" ]; then
  sudo rm -f "$LOG_FILE" || { echo "Failed to remove $LOG_FILE"; exit 1; }
fi

# 로그 파일 생성 및 권한 설정
sudo touch "$LOG_FILE" || { echo "Failed to create $LOG_FILE"; exit 1; }
sudo chmod 666 "$LOG_FILE" || { echo "Failed to set permissions for $LOG_FILE"; exit 1; }
sudo chown ec2-user:ec2-user "$LOG_FILE" || { echo "Failed to set ownership for $LOG_FILE"; exit 1; }

# 로그 기록 시작
echo "====== START: set_permissions.sh ======" >> $LOG_FILE
echo "$(date): Starting permissions setup..." >> $LOG_FILE

# 디렉터리 존재 여부 확인 및 권한 설정
if [ -d "$APP_DIR" ]; then
  echo "$(date): Setting permissions for $APP_DIR" >> $LOG_FILE
  sudo chmod -R 755 "$APP_DIR" >> $LOG_FILE 2>&1
  sudo chown -R ec2-user:ec2-user "$APP_DIR" >> $LOG_FILE 2>&1

  if [ $? -eq 0 ]; then
    echo "$(date): Successfully set permissions for $APP_DIR" >> $LOG_FILE
  else
    echo "$(date): Failed to set permissions for $APP_DIR. Check the logs for details." >> $LOG_FILE
    exit 1
  fi
else
  echo "$(date): Directory $APP_DIR does not exist. Skipping permissions setup." >> $LOG_FILE
fi

# 로그 기록 종료
echo "====== END: set_permissions.sh ======" >> $LOG_FILE
exit 0
