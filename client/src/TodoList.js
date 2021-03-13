import React,{useState,useEffect,useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ToDoItem from './TodoItem';
import Input from '@material-ui/core/Input';
import {useHistory} from 'react-router-dom';
import {config} from './config';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
}));

function TodoList() {
    const classes = useStyles();

    const [todos, setTodos] = useState([])
    const [todoItem,setTodoItem] = useState({"title":'',"details":'',"completed":false})
    const history = useHistory();
    const createUpdateTodo = async (itemObj) =>{
        const path = itemObj?.id ? `${config.todosUrl}/${itemObj?.id}`: config.todosUrl
        console.log(' path => ',path)
        const response = await fetch(path,{
            method: itemObj?.id ? 'PUT' :'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            // 'authorization': `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(itemObj?.id? itemObj : todoItem) 
        })
        const data = await response.json()
        console.log('create todo res ',data)
    }

    const deleteTodo = async (id) =>{
        const path = `${config.todosUrl}/${id}`;
        const response = await fetch(path,{
            method:'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${localStorage.getItem('token')}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
        const data = await response.json()
        console.log('create todo res ',data)
    }


    const fetchTodos = async () =>{
        const response = await fetch(config.todosUrl,{
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'authorization': `Bearer ${localStorage.getItem('token')}`
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        })
        const res = await response.json()
        const {data} = res;
        console.log('updated data',data)
        if(data?.length){
            setTodos(data);
        }else{
            setTodos([])
        }
    }

    useEffect(()=>{
        fetchTodos()
    },[])

    
    const onDeleteCall = (id) =>{
        console.log('TodoList ',id)
        deleteTodo(id);
        setTimeout(()=>{
            fetchTodos();
        },500)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && (todoItem?.title || todoItem?.details)) {
            console.log('todoitem => ',todoItem)
            createUpdateTodo();
            setTimeout(()=>{
                fetchTodos();
            },500)
            const todoObj = {
                title:'',
                details: ''
            }
            setTodoItem(todoObj)
        }
    }
    
    const setInTodos = (e) =>{
        console.log([e.target.name] , e.target.value)
        setTodoItem({...todoItem, [e.target.name] : e.target.value,"completed":false})
    }
    
    const updateTodoTask= (editTodo) =>{
        if(editTodo){
            console.log(' editTodo ->',editTodo)
            createUpdateTodo(editTodo);
            setTimeout(()=>{
                fetchTodos();
            },500)
        }
    }

    const handleTodoDetails = (id) =>{
        history.push('/todos/'+id);
    }

    const TodoListMemo = useMemo(()=> { 
        return <List className={classes.root} id="container">
                {todos.map((item) => {
                    return (
                        <div key={item.id} className="todo_task">
                            <ToDoItem
                                item={item}
                                key={item.id}
                                onDeleteCall={onDeleteCall}
                                todos= {todos}
                                handleTodoDetails={handleTodoDetails}
                                // setTodos={setTodos}
                                updateTodoTask= {updateTodoTask}
                            />
                        </div>
                    );
                })}
        </List>; 
    }, [todos])


    return (
        <div className="todo_list">
            <div className="todo__input">
                <Input
                    disableUnderline={true}
                    name="title"
                    value={todoItem?.title}
                    placeholder={"Title"}
                    style={{"width": "330px"}}
                    onChange={e=>setInTodos(e)}
                    onKeyDown={handleKeyDown}
                />
                <br/>
                <Input
                    disableUnderline={true}
                    value={todoItem?.details}
                    name="details"
                    placeholder={"Details"}
                    style={{"width": "330px"}}
                    onChange={e=>setInTodos(e)}
                    onKeyDown={handleKeyDown}
                />
                {TodoListMemo}
            </div>
        </div>
    )

}

export default TodoList
