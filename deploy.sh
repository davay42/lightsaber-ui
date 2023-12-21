cd dist

git init
git remote add origin git@github.com:davay42/lightsaber-ui.git
git add . --force
git commit -m 'deploy now'

git push -f origin HEAD:gh-pages

cd -