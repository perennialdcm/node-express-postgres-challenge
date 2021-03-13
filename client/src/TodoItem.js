import React, { useState } from "react";
import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
// import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from '@material-ui/core/Tooltip';
import Input from '@material-ui/core/Input';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Checkbox from '@material-ui/core/Checkbox';


export default function ToDoItem({item,todos,updateTodoTask,handleTodoDetails,onDeleteCall}) {

    const [isEdit,setIsEdit] = useState(false);
    
    const [editTodo,setEditTodo] = useState('');
    const {title,details,completed,id} = item;
    const [checked, setChecked] = React.useState(completed);
    
    const handleChange = (event) => {
        console.log(event.target.checked ,title,id)
        updateTodoTask({...item,completed:event.target.checked })
        setChecked(event.target.checked);
    };

    const onEditTask = (id) =>{
        setIsEdit(true);
        const foundParent = todos.find(item=> item.id === id);
        setEditTodo(foundParent)
    }

    const handleClickAway = () => {
        console.log('away ',editTodo)
        setIsEdit(false);
        updateTodoTask(editTodo)
        setEditTodo('')
    };
    
    
    const handleKeyDown = (event) =>{
        if(event.key === 'Enter'){
            console.log('call update api ')
            setIsEdit(false);
            updateTodoTask(editTodo)
            setEditTodo('')
        }
    }
    const setInTodos = (e) =>{
        console.log([e.target.name] , e.target.value)
        setEditTodo({...editTodo, [e.target.name] : e.target.value,"completed":checked})
    }

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className="todo__container">
                {isEdit ? 
                    <React.Fragment>
                        <Input
                            defaultValue={editTodo?.title}
                            style={{"width": "330px"}}
                            onChange={e=>setInTodos(e)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            name="title"
                        />
                        <Input
                            defaultValue={editTodo?.details}
                            style={{"width": "330px"}}
                            onChange={e=>setInTodos(e)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            name="details"
                        />
                    </React.Fragment>
                    :
                    <div className={"todo__item"}>
                        <ListItem key={id} role={undefined} dense button>
                            <div className="todo__text" onClick={()=>handleTodoDetails(id)}>
                                <ListItemText id={id} primary={title} />
                                <ListItemText className="todo__textDetails" id={id} primary={details} />
                            </div>
                            
                            <ListItemSecondaryAction>
                                <Tooltip  title="Edit" placement="top">
                                    <IconButton edge="end" aria-label="edit" onClick={()=>{onEditTask(id)}}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" placement="right-start">
                                    <IconButton onClick={()=>onDeleteCall(id)} edge="end" aria-label="comments">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Checkbox
                                    checked={checked}
                                    onChange={handleChange}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </div>
                }
            </div>
        </ClickAwayListener>
    );
  }
  