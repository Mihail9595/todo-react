import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useTodoApi } from "./useTodoApi";
import { useTodoHelpers } from "./useTodoHelpers";
import { useTodoActions } from "./useTodoActions";

export const useTodoManagement = () => {
  const [todos, setTodos] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorage();
  const { fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoApi();
  const {
    sortedSaveTodos,
    createNewTodo,
    updateTodosData,
    toggleTodoCompletion,
  } = useTodoHelpers();

  useEffect(() => {
    const loadInitialData = async () => {
      const saveTodos = sortedSaveTodos(loadFromLocalStorage());
      setTodos(saveTodos);

      try {
        const serverTodos = await fetchTodos();
        const sortedServerTodos = sortedSaveTodos(serverTodos);
        setTodos(sortedServerTodos);
        saveToLocalStorage(sortedServerTodos);
      } catch (error) {
        console.error("Ошибка загрзуки данных", error);
      }
    };
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const actions = useTodoActions({
    todos,
    setTodos,
    createNewTodo,
    createTodo,
    saveToLocalStorage,
    updateTodosData,
    updateTodo,
    toggleTodoCompletion,
    deleteTodo,
    setIsDeletingCompleted,
    hasCompletedTodos,
  });

  return {
    todos,
    hasCompletedTodos,
    deletingId,
    setDeletingId,
    isDeletingCompleted,
    setIsDeletingCompleted,
    ...actions,
  };
};
