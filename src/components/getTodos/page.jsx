"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const GetTodos = () => {
    const [loading, setLoading] = useState(false);
    const [todo, setTodo] = useState([]);
    const [token, setToken] = useState({});

    useEffect(() => {
        const jwtToken = Cookies.get('jwt'); // Replace 'jwt' with your cookie name
        if (jwtToken) {
            setToken(jwtToken);
            console.log("user token data" , token);
        }
    }, []);

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
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default GetTodos;
