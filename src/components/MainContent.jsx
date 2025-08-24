import { useState } from "react";
import AddTodo from "./AddTodo";
import Header from "./Header";
import TodoList from "./TodoList";
import TodoFilter from "./TodoFilter";

const MainContent = ({
  onAdd,
  todos,
  handleUpdate,
  toggleComplete,
  setDeletingId,
  onReorder,
}) => {
  const [filter, setFilter] = useState("all");

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="flex flex-col gap-3 mx-auto">
      <Header />
      <AddTodo onAdd={onAdd} />

      <TodoFilter filter={filter} setFilter={setFilter} />

      <TodoList
        todos={filteredTodos}
        handleUpdate={handleUpdate}
        toggleComplete={toggleComplete}
        setDeletingId={setDeletingId}
        onReorder={onReorder}
      />
    </div>
  );
};

export default MainContent;
