"use client";

import GetTodos from "@/components/getTodos/page";
import TodoForm from "@/components/todoform/page";

import { useEffect } from "react";

export default function Home() {

  return (
    <main>
      <TodoForm />
      <GetTodos />
    </main>
  );
}
