
# Работ с Docker
Команда сборки образа:
```
docker build -t frontend .
```

Сборка и Запуск контейнера(делается единожды)
```
docker run --name project_name --detach -p 3000:3000 -p 3001:3001 -v "${PWD}/dist:/app/dist" -v "${PWD}/src:/app/src" -v "${PWD}/gulp:/app/gulp" frontend
```

Запуск контейнера
```
docker start project_name
```

Остановка контейнера
```
docker stop project_name
```

Запуск сборки проекта
```
docker exec -it -u node project_name ./node_modules/gulp/bin/gulp.js -f /app/gulp/gulpfile.js build
```

[Ссылка на просмотр сайта](https://localhost:3001/)
