import { lazy, Suspense, useState } from "react";
import ToggleTheme from "./components/toggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { useTodoManagement } from "./hooks/useTodoManagement";
import DeletedCompletedButton from "./components/DeletedCompletedButton";
import Loader from "./components/Loader";

const MainContent = lazy(() => import("./components/MainContent"));

function App() {
  const [theme, setTheme] = useState(getInitialTheme());

  const {
    todos,
    onAdd,
    handleUpdate,
    toggleComplete,
    handleDelete,
    handleDeletedCompleted,
    confirmDeleteCompleted,
    hasCompletedTodos,
    deletingId,
    setDeletingId,
    isDeletingCompleted,
    setIsDeletingCompleted,
    onReorder,
  } = useTodoManagement();

  

  return (
    <div
      data-theme={theme}
      className="flex flex-col justify-center items-center bg-page-light
       dark:bg-page-dark p-6 min-h-screen"
    >
      <ToggleTheme toggleTheme={() => toggleTheme(setTheme)} theme={theme} />

      <Suspense fallback={<Loader />}>
        <MainContent
          onAdd={onAdd}
          todos={todos}
          handleUpdate={handleUpdate}
          toggleComplete={toggleComplete}
          setDeletingId={setDeletingId}
          onReorder={onReorder}
        />{" "}
      </Suspense>

      <DeleteConfirmModal
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          handleDelete(deletingId);
          setDeletingId(null);
        }}
        deletingId={deletingId}
        message="Вы уверены что хотите удалить эту задачу?"
      />

      <DeleteConfirmModal
        onCancel={() => setIsDeletingCompleted(false)}
        onConfirm={confirmDeleteCompleted}
        message={`Вы уверены что хотите удалить все выполненные задачи (${
          todos.filter((todo) => todo.completed).length
        })?`}
        isDeletingCompleted={isDeletingCompleted}
      />

      <DeletedCompletedButton
        onClick={handleDeletedCompleted}
        hasCompletedTodos={hasCompletedTodos}
      />
    </div>
  );
}

export default App;
