import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axios from "axios";

export default function Todo() {
    const [viewCompleted, setViewCompleted] = useState(false);
    const [todoList, setTodoList] = useState([]);
    const [modal, setModal] = useState(false);
    const [activeItem, setActiveItem] = useState({
      title: "",
      description: "",
      completed: false,
    });

    const url = "http://localhost:8000";


    useEffect(() => {
      refreshList();
    }, []);

    function refreshList() {
      axios
        .get("/api/todos/")
        .then((res) => setTodoList(res.data))
        .catch((err) => console.log(err));
    }

    function toggle() {
      setModal((prevState) => !prevState);
    }

    function handleSubmit(item) {
      toggle();

      if (item.id) {
        axios
          .put(`${url}/api/todos/${item.id}/`, item)
          .then((res) => refreshList());
        return;
      }
      axios.post(`${url}/api/todos/`, item).then((res) => refreshList());
    }

    function handleDelete(item) {
      axios.delete(`${url}/${item.id}/`).then((res) => refreshList());
    }

    function createItem() {
      const item = { title: "", description: "", completed: false };
      setModal((prevState) => !prevState);
      setActiveItem(item);
    }

    function editItem(item) {
      setModal((prevState) => !prevState);
      setActiveItem(item);
    }

    function displayCompleted(status) {
      if (status) {
        return setViewCompleted(true);
      }
      return setViewCompleted(false);
    }

    function renderTabList() {
      return (
        <div className="nav nav-tabs">
          <span
            onClick={() => displayCompleted(true)}
            className={viewCompleted ? "nav-link active" : "nav-link"}
          >
            Complete
          </span>
          <span
            onClick={() => displayCompleted(false)}
            className={viewCompleted ? "nav-link" : "nav-link active"}
          >
            Incomplete
          </span>
        </div>
      );
    }

    function renderItems() {
      const newItems = todoList.filter(
        (item) => item.completed === viewCompleted
      );

      return newItems.map((item) => (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span
            className={`todo-title mr-2 ${
              viewCompleted ? "completed-todo" : ""
            }`}
            title={item.description}
          >
            {item.title}
          </span>

          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => editItem(item)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(item)}
            >
              Delete
            </button>
          </span>
        </li>
      ));
    }

    return (
    <>
        <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">
            To-Do List
        </h1>
        <div className="row">
            <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
                <div className="mb-4">
                <button className="btn btn-primary" onClick={createItem}>
                    Add task
                </button>
                </div>
                {renderTabList()}
                <ul className="list-group list-group-flush border-top-0">
                {renderItems()}
                </ul>
            </div>
            </div>
        </div>
        {modal ? (
            <Modal
            activeItem={activeItem}
            toggle={toggle}
            onSave={handleSubmit}
            />
        ) : null}
        </main>
    </>
    );

}