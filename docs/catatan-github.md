menarik kodingan dari branch lain:
git switch staging
git pull

memindahkan kodingan staging - main:
https://github.com/galuhdwicandra/prjk-salve-frontend/compare/main...staging
Jadi
base: main ← compare: staging
==============================
Frontend:
git switch main
git pull
npm run build:staging

Backend:
git switch main
git pull

git log --oneline origin/staging -- src/store/useChatSession.ts