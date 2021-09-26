## Скрипты
* test - запуск тестов
* reader - запуск сервиса reader
* writer - запуск сервиса writer

## Основное задание
- запуск сервисов Reader и Writer с помощью скриптов
- обращение к API сервиса Reader
```javascript
const xhr1 = new XMLHttpRequest();
xhr1.open("POST", 'http://localhost:3000/start?fileName=im.jpg', true);
xhr1.send();
const xhr2 = new XMLHttpRequest();
xhr2.open("POST", 'http://localhost:3000/start?fileName=test.txt', true);
xhr2.send();
```
- результат в хранилище файлов сервиса Writer (fileStorage/writerStorage)

## API Reader
POST /start?fileName=parameter

где parameter - наименование файла из хранилища файлов сервиса Reader (fileStorage/readerStorage)
Запускает процесс считывания и передачи и запись файла в хранилище файлов сервиса Writer (fileStorage/writerStorage).

## Дополнительные задания

### Ситуация обратного давления

### Поддержка различных транспортов
Какая-то абстракция есть, есть что улучшать.

### Покрытие тестами
Времени на покрытие тестами не хватило, добавила 2 элементарных теста.

## TODO
- Рефакторинг кода
- Обработка ошибок
- Настройка параметров и переменных окружения
- Очистка подписок и соединений
- Интерфейс пользователя