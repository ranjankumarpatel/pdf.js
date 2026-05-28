pnpm install
rm -rf build/ docker/build/
npx gulp generic
#bash docker/docker-install.sh