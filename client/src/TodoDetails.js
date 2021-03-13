import React,{useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import { config } from './config';
import { fetchResource } from './api';

function TodoDetails() {
    const [todo,setTodo] = useState({"title":'',"details":'',"completed":false});
    let { id } = useParams();

    const fetchTodoById = async () =>{
        try{
            const data = await fetchResource(`${config.todosUrl}/${id}`)
            setTodo(data[0]);
            console.log('-- data[0]',data[0])
        }catch(err){
            console.log('Error while fetch by id',err);
        }
    }
    useEffect(() => {
        fetchTodoById()
    }, [])
    return (
        <React.Fragment>
            <Link to="/">BACK</Link>
            <div className="todo_container">
                <div className="todo__Details">
                    <div className="todo_item">
                        <h2> Title </h2> : 
                        <h3> {todo?.title}</h3>
                    </div>
                    
                    <div className="todo_item">
                        <h2> Details </h2> : 
                        <h3> {todo?.details}</h3>
                    </div>

                    <div className="todo_item">
                        <h2> Status </h2> : 
                        <h3> {todo?.completed ? 'COMPLETED' : 'NOT COMPLETED'}</h3>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TodoDetails
