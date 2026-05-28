# Refresh the build files copied from the repo root (clean first to avoid nesting)
rm -rf ./build
cp -r ../build ./build

# Remove any existing viewer container. Older runs named it "keycloak",
# newer ones "pdfjs-viewer" - force-remove both so port 8080 is freed.
docker rm -f keycloak pdfjs-viewer 2>/dev/null || true
docker rmi -f pdfjs-viewer docker13972684/pdfjs-viewer:latest 2>/dev/null || true
docker volume ls -qf dangling=true | xargs -r docker volume rm

docker build --no-cache --tag=pdfjs-viewer:latest .
docker tag pdfjs-viewer:latest docker13972684/pdfjs-viewer:latest

# Publish (optional). Prefer --password-stdin over inline password.
echo "Docker@13972684" | docker login --username=docker13972684 --password-stdin
docker push docker13972684/pdfjs-viewer:latest

docker run -dit --name pdfjs-viewer -p 8080:8080 pdfjs-viewer:latest
