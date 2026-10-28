#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  Urban Glimmer - Hostinger Packager      "
echo "=========================================="

echo "[1/4] Running production build with standalone output..."
npm run build

echo "[2/4] Assembling standalone deployment directory..."
mkdir -p .next/standalone/.next
rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Create a sample package.json and ecosystem file for PM2 / Hostinger Node.js
cat << 'EOF' > .next/standalone/.env.example
NODE_ENV=production
PORT=3000
HOSTNAME="0.0.0.0"
EOF

# Create a helper start script for Hostinger
cat << 'EOF' > .next/standalone/start.sh
#!/usr/bin/env bash
export NODE_ENV=production
export PORT=${PORT:-3000}
export HOSTNAME="0.0.0.0"
node server.js
EOF
chmod +x .next/standalone/start.sh

echo "[3/4] Packaging into deploy-hostinger.zip..."
rm -f deploy-hostinger.zip
cd .next/standalone
zip -q -r ../../deploy-hostinger.zip .
cd ../..

echo "[4/4] Complete!"
ZIP_SIZE=$(du -h deploy-hostinger.zip | cut -f1)
echo "------------------------------------------"
echo "✅ deploy-hostinger.zip created ($ZIP_SIZE)"
echo "Ready for 1-click upload in Hostinger hPanel File Manager!"
echo "------------------------------------------"
