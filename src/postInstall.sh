set -e

VERSION="0.0.21"

curl -L https://github.com/shukriadams/bootstrip/releases/download/$VERSION/bootstrip.js --output ./static/js/bootstrip.js
curl -L https://github.com/shukriadams/bootstrip/releases/download/$VERSION/bootstrip.css --output ./static/css/bootstrip.css
curl -L https://github.com/shukriadams/bootstrip/releases/download/$VERSION/bootstrip-theme-default.css --output ./static/css/bootstrip-theme-default.css
curl -L https://github.com/shukriadams/bootstrip/releases/download/$VERSION/bootstrip-theme-darkmoon.css --output ./static/css/bootstrip-theme-darkmoon.css 