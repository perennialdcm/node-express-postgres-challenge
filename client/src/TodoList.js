import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ToDoItem from './TodoItem';
import Input from '@material-ui/core/Input';
import {useHistory} from 'react-router-dom';
import {config} from './config';
import { fetchResource,deleteResource, createORUpdateResource } from './api';

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
        const path = itemObj?.id ? `${config.todosUrl}/${itemObj?.id}`: config.todosUrl;
        const obj = itemObj?.id? itemObj : todoItem;
        console.log(' path => ',path)
        createORUpdateResource(path,obj)
    }

    const deleteTodo = async (id) =>{
        const path = `${config.todosUrl}/${id}`;
        deleteResource(path);
    }   

    const fetchTodos = async () =>{
        const data = await fetchResource(config.todosUrl)
        setTodos(data);
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

    const TodoListMemo = ()=> { 
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
    }


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
                {TodoListMemo()}
            </div>
        </div>
    )

}

export default TodoList
