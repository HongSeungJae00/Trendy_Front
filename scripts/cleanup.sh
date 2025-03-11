#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"
DEPLOY_DIR="/home/ec2-user/Trendy_Front"
DISK_THRESHOLD=5000000  # 💾 디스크 공간이 5GB 이하 (단위: KB)

echo "====== START: cleanup.sh ======" >> "$LOG_FILE"
echo "$(date): Cleaning up old deployment files..." >> "$LOG_FILE"

# ✅ 애플리케이션 실행 중이면 중지 (PM2 사용)
if pgrep -x "node" > /dev/null; then
  echo "$(date): Stopping running application using PM2..." >> "$LOG_FILE"
  sudo pm2 stop all || true
  sudo pm2 delete all || true
fi

# ✅ 배포 디렉토리 내 중요한 파일은 보존하고 나머지 삭제
EXCLUDE_FILES=(".env" "config")  # ❗️ package.json 삭제 허용

if [ -d "$DEPLOY_DIR" ]; then
  echo "$(date): Cleaning up deployment directory except for protected files..." >> "$LOG_FILE"
  
  # 디렉토리 내의 파일 중 제외 목록을 제외한 나머지를 삭제
  for item in "$DEPLOY_DIR"/*; do
    skip=false
    for exclude in "${EXCLUDE_FILES[@]}"; do
      if [[ "$(basename "$item")" == "$exclude" ]]; then
        skip=true
        break
      fi
    done
    if [ "$skip" = false ]; then
      sudo rm -rf "$item"
      echo "$(date): Removed $item" >> "$LOG_FILE"
    else
      echo "$(date): Skipped $item" >> "$LOG_FILE"
    fi
  done
else
  echo "$(date): Deployment directory does not exist. Creating now..." >> "$LOG_FILE"
  sudo mkdir -p "$DEPLOY_DIR"
fi

# ✅ 충돌 방지: package.json 파일 삭제 (남아 있을 경우)
PACKAGE_JSON="$DEPLOY_DIR/package.json"
if [ -f "$PACKAGE_JSON" ]; then
  echo "$(date): Removing existing package.json to prevent conflicts..." >> "$LOG_FILE"
  sudo rm -f "$PACKAGE_JSON"
fi

# ✅ 기존 .next 디렉토리 삭제 (Next.js 캐시 제거)
if [ -d "$DEPLOY_DIR/.next" ]; then
  echo "$(date): Removing .next directory to prevent conflicts..." >> "$LOG_FILE"
  sudo rm -rf "$DEPLOY_DIR/.next"
fi

# ✅ 특정 충돌 파일 삭제 (예: register.html)
CONFLICT_FILE="$DEPLOY_DIR/.next/server/app/admin/inspection/register.html"
if [ -f "$CONFLICT_FILE" ]; then
  echo "$(date): Conflict file found. Removing $CONFLICT_FILE..." >> "$LOG_FILE"
  sudo rm -f "$CONFLICT_FILE"
fi

# ✅ npm 캐시 삭제 (디스크 공간 확보)
echo "$(date): Cleaning NPM cache..." >> "$LOG_FILE"
npm cache clean --force

# ✅ /tmp 디렉토리 정리
echo "$(date): Cleaning up temporary files in /tmp..." >> "$LOG_FILE"
sudo rm -rf /tmp/*

# ✅ 디스크 공간 부족 시 /var/log 정리
DISK_USAGE=$(df --output=avail -k / | tail -1)
if [[ "$DISK_USAGE" -lt "$DISK_THRESHOLD" ]]; then
  echo "$(date): Disk space is low ($DISK_USAGE KB). Removing old logs from /var/log..." >> "$LOG_FILE"
  sudo find /var/log -type f -name "*.log" -delete
fi

# ✅ 권한 설정
echo "$(date): Setting correct permissions for $DEPLOY_DIR..." >> "$LOG_FILE"
sudo chown -R ec2-user:ec2-user "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

# ✅ 디스크 상태 확인
echo "$(date): Disk space after cleanup:" >> "$LOG_FILE"
df -h >> "$LOG_FILE"

echo "====== END: cleanup.sh ======" >> "$LOG_FILE"
exit 0
