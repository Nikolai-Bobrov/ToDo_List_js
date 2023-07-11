(function (){

    let nameInStore = 'todoArray';
    let todoItemsUser = [];
    function saveToStores() {
        console.log(todoItemsUser);
        if(localStorage.getItem(nameInStore)){
            localStorage.removeItem(nameInStore);
            localStorage.setItem(nameInStore, JSON.stringify(todoItemsUser));
        } else{
            localStorage.setItem(nameInStore, JSON.stringify(todoItemsUser));
        }

    }
    function loadToStore() {
        return JSON.parse(localStorage.getItem(nameInStore)) || [];
    }
    // создаем и возвращаем заголовок приложения
    function  createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div')
        let button = document.createElement('button')

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = "Введите название нового дела";
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.disabled = true;
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    // создаем и возвращаем список элементов
    function  createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name) {
        let item = document.createElement('li');
        // кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // устанавливаем стили для элемента списка, а так же для размещения кнопок
        // в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // вкладываем кнопки в отдельный елемент, чтобы они обьединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function createTodoApp(container, title) {
        console.log(title);
        switch (title){
            case "Мои дела": {
                nameInStore = 'myDeal'
                break
            }
            case "Дела папы": {
                nameInStore = 'dadDeal'
                break
            }
            case "Дела мамы": {
                nameInStore = 'momDeal'
                break
            }
        }

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        const loadArray = loadToStore();
        if(loadArray.length){
            todoItemsUser = loadArray;
        } else {
            todoItemsUser = [
                {name: 'Сходить в магазин', done: false },
                {name: 'Купить гвоздей', done: false},
                {name: 'Забрать долг', done: true},
            ];
        }


        if (todoItemsUser.length) {
            for (let obj of todoItemsUser) {
                let todoItemUser = createTodoItem(obj["name"]);
                todoList.append(todoItemUser.item);

                todoItemUser.doneButton.addEventListener('click', function () {
                    todoItemUser.item.classList.toggle('list-group-item-success');
                    obj.done = !obj.done
                    saveToStores()
                });
                todoItemUser.deleteButton.addEventListener('click', function () {
                    if (confirm('Вы уверены?')) {
                        console.log("todoItemUser.item: ", todoItemUser.item)
                        todoItemUser.item.remove();

                        const indexItem = todoItemsUser.findIndex(item => item.name === obj.name);

                        if (indexItem === 0) {
                            todoItemsUser.shift()
                        } else if (indexItem === todoItemsUser.length - 1) {
                            todoItemsUser.pop()
                        } else {
                            todoItemsUser.splice(indexItem, 1);
                        }

                        saveToStores()
                    }
                });
                if (obj["done"] === true) {
                    todoItemUser.item.classList.toggle('list-group-item-success');
                }
            }
        }

        // при вводе в input убирает атрибут disabled
        todoItemForm.input.addEventListener('input', function (){
            if(todoItemForm.input.value == 0){
                todoItemForm.button.disabled = true;
            }
            else {
                todoItemForm.button.disabled = false;
            }

        })

        // браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e){
            // эта строчка необходима, чтобы предотвратить стандартное действия браузера
            //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            // игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            let todoItem = createTodoItem(todoItemForm.input.value);
            //добавляю новое дело в массив
            const newItemTodo = {
                name: todoItemForm.input.value,
                done: false,
            }

            todoItemsUser.push(newItemTodo);

            // добавляем обработчики на кнопки
            todoItem.doneButton.addEventListener('click', function () {
                todoItem.item.classList.toggle('list-group-item-success');
                newItemTodo.done = !newItemTodo.done;
                saveToStores()
            });
            todoItem.deleteButton.addEventListener('click', function () {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    saveToStores()
                }
            });
            // создаем и добовляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);
            saveToStores()
            // console.log(todoItemForm.input.value);

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;
        })
    }




    window.createTodoApp = createTodoApp;
})();

