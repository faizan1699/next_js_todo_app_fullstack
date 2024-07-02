import GetTodos from "@/components/getTodos/page";
import TodoForm from "@/components/todoform/page";

export default function Home() {
  return (
    <main>
      <TodoForm />
      <GetTodos />
    </main>
  );
}
