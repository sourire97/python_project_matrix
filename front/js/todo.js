readTodo();

async function readTodo(){

    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }

    const config = {
        method : "get",
        url : url + "/todos",
        headers : {"x-access-token": token},
    };

    try {
        const res = await axios(config);

        if(res.data.code !== 200){
            alert(res.data.message);
            return false;
        }

        const todoDataSet = res.data.result;
        console.log(todoDataSet);

        for(let section in todoDataSet) {

            //각 섹션에 해당하는 ul 태그 선택
            const SectionUl = document.querySelector(`#${section} ul`);
            //각 섹션에 해당하는 데이터
            const arrayForEachSection = todoDataSet[section];
            console.log(arrayForEachSection);

            let result = "";
            for(let todo of arrayForEachSection) {
                let element = `<li class="list-item" id=${todo.todoIdx}>
                    <div class="done-text-container">
                        <input type="checkbox" class="todo-done" ${todo.status==='C' ? "checked" : ""}/>
                        <p class="todo-text">
                            ${todo.contents}
                        </p>
                    </div>
                    <div class="update-delete-container">
                    <i class="todo-update fas fa-pencil-alt"></i>
                    <i class="todo-delete fas fa-trash-alt"></i>
                    </div>
                </li>
                `;
                result += element;
            }
            SectionUl.innerHTML = result;
        }
    } catch (err) {
        console.error(err);
    }
}

//일정 cud
const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);

function cudController(event){
    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }
    const target = event.target;
    const targetTagName = target.tagName;
    const eventType = event.type;
    const key = event.key;

    console.log(target, targetTagName, eventType, key);

    //create 이벤트처리
    if(targetTagName === "INPUT" && key === "Enter"){
        createTodo(event, token);
        return;
    }

    //update 이벤트처리

    //체크박스
    if(target.className === "todo-done" && eventType === "click"){
        updateTodoDone(event, token);
        return;
    }

    //컨텐츠
    const firstClassName = target.className.split(" ")[0];
    if(firstClassName === "todo-update" && eventType === "click"){
        updateTodoContents(event, token);
        return;
    }

    //delete
    if(firstClassName === "todo-delete" && eventType === "click"){
        deleteTodo(event, token);
        return;
    }

}

async function createTodo(event, token){
    const contents = event.target.value;
    const type = event.target.closest(".matrix-item").id;

    if(!contents){
        alert("내용을 입력해주세요")
        return false;
    }

    const config = {
        method : "post",
        url : url + "/todo",
        headers : { "x-access-token" : token },
        data : {
            contents : contents,
            type : type,
        },
    };

    try{
    const res = await axios(config);

    if(res.data.code !== 200){
        alert(res.data.message);
        return false;
    }
    
    //DOM 업데이트
    readTodo();

    //입력값 지워지게 하기
    event.target.value = "";
    return true;

    } catch(err){
        console.error(err);
    }
}

async function updateTodoDone(event,token){
    console.log(event.target.checked);

    const status = event.target.checked ? "C" : "A";
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method : "patch",
        url : url + "/todo",
        headers : { "x-access-token" : token },
        data : {
            todoIdx : todoIdx,
            status : status,
        },
    };

    try{
    const res = await axios(config);

    if(res.data.code !== 200){
        alert(res.data.message);
        return false;
    }

    //DOM 업데이트
    readTodo();

    } catch(err){
        console.error(err);
        return false;
    }
}

async function updateTodoContents(event,token){

    const contents = prompt("내용을 입력해주세요");
    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method : "patch",
        url : url + "/todo",
        headers : { "x-access-token" : token },
        data : {
            todoIdx : todoIdx,
            contents : contents,
        },
    };

    try{
    const res = await axios(config);

    if(res.data.code !== 200){
        alert(res.data.message);
        return false;
    }

    //DOM 업데이트
    readTodo();

    } catch(err){
        console.error(err);
        return false;
    }
}

async function deleteTodo(event,token){

    const isValidReq = confirm("정말 삭제하시겠습니까?");

    if(!isValidReq){
        return false;
    }

    const todoIdx = event.target.closest(".list-item").id;

    const config = {
        method : "delete",
        url : url + `/todo/${todoIdx}`,
        headers : { "x-access-token" : token },
    };

    try{
    const res = await axios(config);

    if(res.data.code !== 200){
        alert(res.data.message);
        return false;
    }

    //DOM 업데이트
    readTodo();

    } catch(err){
        console.error(err);
        return false;
    }
}