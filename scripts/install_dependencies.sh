#!/bin/bash

LOG_FILE="/home/ec2-user/deployment.log"
DEPLOY_DIR="/home/ec2-user/Trendy_Front"
NODE_VERSION="22"

echo "====== START: install_dependencies.sh ======" >> "$LOG_FILE"
echo "$(date): Starting dependency installation..." >> "$LOG_FILE"

# ✅ NVM이 설치되어 있는지 확인하고, 없으면 설치
if ! command -v nvm &> /dev/null; then
  echo "$(date): nvm not found. Installing nvm..." >> "$LOG_FILE"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
  
  # ✅ NVM 환경 변수 적용
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# ✅ NVM 적용
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# ✅ Node.js 버전 확인 및 설치
echo "$(date): Ensuring Node.js version $NODE_VERSION is used..." >> "$LOG_FILE"
if ! nvm use $NODE_VERSION >> "$LOG_FILE" 2>&1; then
  echo "$(date): Node.js $NODE_VERSION not found. Installing..." >> "$LOG_FILE"
  nvm install $NODE_VERSION >> "$LOG_FILE" 2>&1
fi
nvm use $NODE_VERSION >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "$(date): Failed to use Node.js version $NODE_VERSION. Exiting." >> "$LOG_FILE"
  exit 1
fi

echo "$(date): Current Node.js version: $(node -v)" >> "$LOG_FILE"
echo "$(date): Current npm version: $(npm -v)" >> "$LOG_FILE"

# ✅ 배포 디렉터리 이동
if [ -d "$DEPLOY_DIR" ]; then
  cd "$DEPLOY_DIR" || {
    echo "$(date): Failed to change directory to $DEPLOY_DIR. Exiting." >> "$LOG_FILE"
    exit 1
  }
else
  echo "$(date): Deployment directory $DEPLOY_DIR does not exist. Creating it..." >> "$LOG_FILE"
  sudo mkdir -p "$DEPLOY_DIR"
  if [ $? -ne 0 ]; then
    echo "$(date): Failed to create deployment directory. Exiting." >> "$LOG_FILE"
    exit 1
  fi
fi

# ✅ npm 캐시 정리 (설치 문제 방지)
echo "$(date): Clearing npm cache..." >> "$LOG_FILE"
npm cache clean --force >> "$LOG_FILE" 2>&1

# ✅ 안전한 의존성 설치
echo "$(date): Installing runtime dependencies..." >> "$LOG_FILE"
npm ci --omit=dev >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "$(date): Successfully installed dependencies." >> "$LOG_FILE"
else
  echo "$(date): npm ci failed. Retrying with npm rebuild..." >> "$LOG_FILE"
  npm rebuild >> "$LOG_FILE" 2>&1
fi

# ✅ TypeScript 패키지 강제 설치
echo "$(date): Installing required devDependencies for build (typescript, @types/node)..." >> "$LOG_FILE"
npm install --save-dev typescript @types/node >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "$(date): Successfully installed TypeScript devDependencies." >> "$LOG_FILE"
else
  echo "$(date): Failed to install TypeScript devDependencies. Exiting." >> "$LOG_FILE"
  exit 1
fi

# ✅ SWC 바이너리 설치 (플랫폼 확인 후 적절한 패키지 설치)
if uname -a | grep -q "x86_64"; then
  SWC_PACKAGE="@next/swc-linux-x64-gnu"
else
  SWC_PACKAGE="@next/swc-linux-x64-musl"
fi

echo "$(date): Installing SWC binaries ($SWC_PACKAGE)..." >> "$LOG_FILE"
npm install $SWC_PACKAGE >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "$(date): Successfully installed SWC binaries." >> "$LOG_FILE"
else
  echo "$(date): Failed to install SWC binaries. Exiting." >> "$LOG_FILE"
  exit 1
fi

# ✅ 권한 설정
echo "$(date): Setting permissions for deployment directory..." >> "$LOG_FILE"
sudo chown -R ec2-user:ec2-user "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"

echo "====== END: install_dependencies.sh ======" >> "$LOG_FILE"
exit 0
