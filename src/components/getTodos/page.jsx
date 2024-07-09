"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const GetTodos = () => {
    const [loading, setLoading] = useState(false);
    const [todo, setTodo] = useState([]);


    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('api/usersdata/gettodos');
            setTodo(response?.data?.todos || []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching todos:', error);
        }
    };
    const deleteTodo = async (todoId) => {
        try {
            const response = await axios.delete(`api/usersdata/delete_todo`, todoId);
            console.log(response);
            setTodo(todo.filter(todo => todo._id !== todoId));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            {loading ? (
                <div>Loading, please wait...</div>
            ) : (
                <div>

                    {todo.length === 0 ? (
                        <div>
                            Nothing to show, please add some todos to display.
                        </div>
                    ) : (
                        todo.map((data, index) => (
                            <div key={index}>
                                <div>Todo: {data.todo}</div>
                                <div>Description: {data.description}</div>
                                <div>Created At: {data.createdAt}</div>
                                <div>id: {data._id}</div>
                                <button onClick={() => deleteTodo(data._id)}>Delete</button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default GetTodos;
