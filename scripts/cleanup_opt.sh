#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"
echo "====== START: cleanup_opt.sh ======" >> "$LOG_FILE"
echo "$(date): Starting /opt cleanup process..." >> "$LOG_FILE"

# CodeDeploy 관련 디렉터리 경로
CODEDEPLOY_ROOT="/opt/codedeploy-agent/deployment-root"
CODEDEPLOY_LOGS="/opt/codedeploy-agent/deployment-root/deployment-logs"

# 1️⃣ CodeDeploy 배포 데이터 정리 (최근 3개 유지)
if [ -d "$CODEDEPLOY_ROOT" ]; then
  echo "$(date): Removing old deployments, keeping only the latest 3." >> "$LOG_FILE"
  sudo ls -t "$CODEDEPLOY_ROOT" | tail -n +4 | xargs -I {} sudo rm -rf "$CODEDEPLOY_ROOT/{}"
fi

# 2️⃣ 기존 CodeDeploy 로그 삭제
if [ -d "$CODEDEPLOY_LOGS" ]; then
  echo "$(date): Deleting all existing CodeDeploy logs..." >> "$LOG_FILE"
  sudo rm -rf "$CODEDEPLOY_LOGS"/*
fi

# 3️⃣ 디스크 상태 확인
echo "$(date): Disk space after cleanup:" >> "$LOG_FILE"
df -h >> "$LOG_FILE"

echo "====== END: cleanup_opt.sh ======" >> "$LOG_FILE"
exit 0
