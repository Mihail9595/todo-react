export const useTodoHelpers = () => {
  const sortedSaveTodos = (todos) => {
    return [...todos].sort((a, b) => a.order - b.order);
  };

  const createNewTodo = (text, deadline, order) => ({
    // временный id
    id: `temp_${Date.now()}`,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline: deadline || null,
    order,
  });

  const updateTodosData = (todo, newText, newDeadline) => ({
    ...todo,
    text: newText,
    deadline: newDeadline,
  });

  const toggleTodoCompletion = (todo) => ({
    ...todo,
    completed: !todo.completed,
  });

  return {
    sortedSaveTodos,
    createNewTodo,
    updateTodosData,
    toggleTodoCompletion,
  };
};
