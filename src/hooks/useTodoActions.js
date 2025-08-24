export const useTodoActions = ({
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
}) => {
  const onAdd = async (text, deadline) => {
    const newTodo = createNewTodo(text, deadline, todos.order + 1);

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);

    try {
      const createdTodo = await createTodo(newTodo);
      //подставляем id с сервера в массив
      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo
      );

      setTodos(syncedTodos);
      saveToLocalStorage(syncedTodos);
    } catch (error) {
      console.error("Ошибка добавления", error);
      setTodos(todos);
    }
  };

  const handleUpdate = async (id, newDeadline, newText) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = updateTodosData(todoToUpdate, newText, newDeadline);

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );

    setTodos(updatedTodos);

    try {
      await updateTodo(id, updatedTodo);
      saveToLocalStorage(updatedTodos);
    } catch (error) {
      console.error("Ошибка обновления", error);
      setTodos(todos);
    }
  };

  const toggleComplete = async (id) => {
    const todoUpdate = todos.find((todo) => todo.id === id);

    if (!todoUpdate) return;

    const updatedTodo = toggleTodoCompletion(todoUpdate);

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo
    );

    setTodos(updatedTodos);

    try {
      await updateTodo(id, updatedTodo);
      saveToLocalStorage(updatedTodos);
    } catch (error) {
      console.error("Ошибка обновления", error);
      setTodos(todos);
    }
  };

  const handleDelete = async (id) => {
    const previousTodos = todos;
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      await deleteTodo(id);
      saveToLocalStorage(updatedTodos);
    } catch (error) {
      console.error("Ошибка удаления", error);
      setTodos(previousTodos);
    }
  };

  const handleDeletedCompleted = () => {
    if (!hasCompletedTodos) return;
    setIsDeletingCompleted(true);
  };

  const confirmDeleteCompleted = async () => {
    const originalTodos = [...todos];

    const comletedIds = originalTodos
      .filter((t) => t.completed)
      .map((t) => t.id);

    setTodos(originalTodos.filter((todo) => !todo.completed));

    const failedIds = [];

    for (const id of comletedIds) {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error(`Ошибка удаления задачи ${id}:`, error);
        failedIds.push(id);
      }
    }

    if (failedIds.length > 0) {
      setTodos(
        originalTodos.filter(
          (todo) => !todo.completed || failedIds.includes(todo.id)
        )
      );
    }

    saveToLocalStorage(todos);

    setIsDeletingCompleted(false);
  };

  const onReorder = async (activeId, overId) => {
    if (!overId) return;
    try {
      const activeIndex = todos.findIndex((todo) => todo.id === activeId);
      const overIndex = todos.findIndex((todo) => todo.id === overId);

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
        return;

      const newTodos = [...todos];
      const [movedTodo] = newTodos.splice(activeIndex, 1);
      newTodos.splice(overIndex, 0, movedTodo);
      const updatedTodos = newTodos.map((todo, index) => ({
        ...todo,
        order: index + 1,
      }));
      setTodos(updatedTodos);

      for (const todo of updatedTodos) {
        try {
          await updateTodo(todo.id, { order: todo.order });
        } catch (error) {
          console.error(`Ошибка обновления задачи ${todo.id}:`, error);
          // Можно добавить откат или повторную попытку
        }
      }

      // await Promise.all(
      //   updatedTodos.map((todo) =>
      //     fetch(`${API_URL}/${todo.id}`, {
      //       method: "PUT",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ order: todo.order }),
      //     })
      //   )
      // );

      saveToLocalStorage(updatedTodos);
    } catch (error) {
      console.error("Ошибка изменения порядка:", error);
      setTodos(todos);
    }
  };

  return {
    onAdd,
    handleUpdate,
    toggleComplete,
    handleDelete,
    handleDeletedCompleted,
    confirmDeleteCompleted,
    onReorder,
  };
};
