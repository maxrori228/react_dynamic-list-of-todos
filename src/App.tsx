import React, { useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';

import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [todos, SetTodos] = useState<Todo[]>([]);
  const [loading, SetLoading] = useState(true);
  const [showError, SetShowError] = useState('');
  const [isModalOpen, SetIsModalOpen] = useState(false);
  const [selectedTodo, SetSelectedTodo] = useState<Todo | null>(null);
  const [query, SetQuery] = useState('');
  const [chosenFilter, SetChosenFilter] = useState('all');

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await getTodos();

        SetTodos(data);
      } catch {
        SetShowError('Loading Failed!');
      } finally {
        SetLoading(false);
      }
    };

    loadTodos();
  }, []);

  const handleOpenMod = (todo: Todo) => {
    if (todo) {
      SetSelectedTodo(todo);
      SetIsModalOpen(true);
    }
  };

  const handeCloseMod = () => {
    SetIsModalOpen(false);
    SetSelectedTodo(null);
  };

  const enableTitle = () => {
    SetQuery('');
  };

  const getVisibleTodos = (
    todosList: Todo[],
    queryFilter: string,
    chosenFilt: string,
  ): Todo[] => {
    let visibleTodos = [...todosList];

    if (queryFilter.trim() !== '') {
      visibleTodos = visibleTodos.filter(todo =>
        todo.title.toLowerCase().includes(queryFilter.toLowerCase().trim()),
      );
    }

    if (chosenFilt === 'completed') {
      visibleTodos = visibleTodos.filter(todo => todo.completed === true);
    }

    if (chosenFilt === 'active') {
      visibleTodos = visibleTodos.filter(todo => todo.completed === false);
    }

    return visibleTodos;
  };

  const visibleTodos = useMemo(() => {
    return getVisibleTodos(todos, query, chosenFilter);
  }, [todos, query, chosenFilter]);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                enableTitle={enableTitle}
                SetQuery={SetQuery}
                query={query}
                chosenFilter={chosenFilter}
                SetChosenFilter={SetChosenFilter}
              />
            </div>

            <div className="block">
              {loading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={visibleTodos}
                  openMod={handleOpenMod}
                  selectedTodo={selectedTodo}
                />
              )}
              {showError && <p className="error">{showError}</p>}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TodoModal closeMod={handeCloseMod} todo={selectedTodo} />
      )}
    </>
  );
};
