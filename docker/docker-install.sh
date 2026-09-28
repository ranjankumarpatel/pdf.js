# Run from this script's directory so relative paths work from any cwd.
cd "$(dirname "$0")" || exit 1

# Refresh the build files copied from the repo root (clean first to avoid nesting).
# The image serves build/generic; without this copy it serves nothing (404).
if [ ! -f ../build/generic/web/viewer.html ]; then
  echo "Missing ../build/generic - run install.sh (npx gulp generic) first." >&2
  exit 1
fi
rm -rf ./build
cp -r ../build ./build

# Publish (optional). Prefer --password-stdin over inline password.
 echo "Docker@13972684" | docker login --username=docker13972684 --password-stdin

# Remove any existing viewer container. Older runs named it "keycloak",
# newer ones "pdfjs-viewer" - force-remove both so port 8080 is freed.
docker rm -f keycloak pdfjs-viewer 2>/dev/null || true
docker rmi -f pdfjs-viewer docker13972684/pdfjs-viewer:latest 2>/dev/null || true
docker volume ls -qf dangling=true | xargs -r docker volume rm

docker build --no-cache --tag=pdfjs-viewer:latest .
#docker tag pdfjs-viewer:latest docker13972684/pdfjs-viewer:latest


# docker push docker13972684/pdfjs-viewer:latest

docker run -dit --name pdfjs-viewer -p 8080:8080 pdfjs-viewer:latest
