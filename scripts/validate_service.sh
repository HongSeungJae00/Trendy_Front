#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"

# 로그 파일 존재 여부 확인 및 생성
if [ ! -f "$LOG_FILE" ]; then
  touch "$LOG_FILE"
  chmod 666 "$LOG_FILE"
fi

echo "====== START: validate_service.sh ======" >> "$LOG_FILE"
echo "$(date): Starting service validation..." >> "$LOG_FILE"

# 설정 변수
SERVICE_URL="http://localhost:3000"
SERVICE_PORT=3000
MAX_RETRIES=10
RETRY_INTERVAL=3

# 포트 확인
echo "$(date): Checking if port $SERVICE_PORT is open..." >> "$LOG_FILE"
for ((i=1; i<=MAX_RETRIES; i++)); do
  if netstat -tuln | grep -q ":$SERVICE_PORT"; then
    echo "$(date): Port $SERVICE_PORT is open." >> "$LOG_FILE"
    break
  fi
  echo "$(date): Port $SERVICE_PORT is not open. Retrying in $RETRY_INTERVAL seconds... ($i/$MAX_RETRIES)" >> "$LOG_FILE"
  sleep "$RETRY_INTERVAL"
done

if ! netstat -tuln | grep -q ":$SERVICE_PORT"; then
  echo "$(date): Port $SERVICE_PORT failed to open after $MAX_RETRIES retries. Exiting validation." >> "$LOG_FILE"
  echo "====== END: validate_service.sh ======" >> "$LOG_FILE"
  exit 1
fi

# 서비스 상태 확인
echo "$(date): Sending HTTP request to $SERVICE_URL..." >> "$LOG_FILE"
for ((i=1; i<=MAX_RETRIES; i++)); do
  STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}" "$SERVICE_URL")
  if [ "$STATUS_CODE" -eq 200 ]; then
    echo "$(date): Service is running successfully with status code: $STATUS_CODE" >> "$LOG_FILE"
    echo "$(date): Validation successful!" >> "$LOG_FILE"
    echo "====== END: validate_service.sh ======" >> "$LOG_FILE"
    exit 0
  fi
  echo "$(date): Service returned status code $STATUS_CODE. Retrying in $RETRY_INTERVAL seconds... ($i/$MAX_RETRIES)" >> "$LOG_FILE"
  sleep "$RETRY_INTERVAL"
done

# 서비스 상태 확인 실패 시
echo "$(date): Service validation failed after $MAX_RETRIES retries. Status code: $STATUS_CODE" >> "$LOG_FILE"
echo "====== END: validate_service.sh ======" >> "$LOG_FILE"
exit 1
