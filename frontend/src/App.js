import React, { Component } from 'react';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todoList: [],
            activeItem: {
                id: null,
                title: '',
                completed: false,
            },
            editing: false
        }
    }

    getCookie = name => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    componentDidMount() {
        this.fetchTasks();
    }

    fetchTasks = () => {
        console.log('Fetching...');

        fetch('http://127.0.0.1:8000/api/task-list/')
          .then(response => response.json())
          .then(data => {
            this.setState({
                todoList: data
            });
          })
          .catch(err => {
            console.log('Error Fetching:', err);
        } );
    }

    handleChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        console.log("Value:", value);

        this.setState({
            activeItem: {
                ...this.state.activeItem,
                title: value
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log("ITEM:", this.state.activeItem);
        
        const csrftoken = this.getCookie('csrftoken');
        var url = 'http://127.0.0.1:8000/api/task-create/';


        if(this.state.editing == false) {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(this.state.activeItem)
            })
            .then(response => {
                this.fetchTasks();
                this.setState({
                    activeItem: {
                        id: null,
                        title: '',
                        completed: false,
                    }
                });
            })
            .catch(error => {
                console.log('ERROR:', error);
            } );
        }
        else if(this.state.editing == true) {
            url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;

            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(this.state.activeItem)
            })
              .then(response => {
                this.fetchTasks();
                this.setState({
                    activeItem: {
                        id: null,
                        title: '',
                        completed: false,
                    }
                });
              })
              .catch(error => {
                console.log('ERROR:', error)
            } )
        }
    }

    startEdit(task) {
        this.setState({
            activeItem: task,
            editing: true,
        });
    }

    deleteItem(task) {
        const csrftoken = this.getCookie('csrftoken');

        fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })
          .then(res => {
            this.fetchTasks();
          })
          .catch(err => {
            console.log('ERROR:', err);
        } );
    }
    
    render() {
        const tasks = this.state.todoList
        return (
            <div className='container'>
                
                <div id="task-container">
                    <div id="form-wrapper">
                        <form onSubmit={this.handleSubmit} id="form">
                            <div className="flex-wrapper">
                                <div style={{flex: 6}}>
                                    <input onChange={this.handleChange} className="form-control" id="title" value={this.state.activeItem.title} type="text" name="title" placeholder="Add Task.." />
                                </div>

                                <div style={{flex: 1}}>
                                    <input id="submit" className="btn btn-warning" type="submit" name="Add" value="Submit" />
                                </div>
                            </div>

                        </form>
                    </div>

                    <div className="list-wrapper">
                        {tasks.map((task, index) => (
                            <div key={index} className="task-wrapper flex-wrapper">

                                <div style={{flex:7}}>
                                    <span>{task.title}</span>
                                </div>

                                <div style={{flex:1}}>
                                    <button onClick={() => this.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                                </div>

                                <div style={{flex:1}}>
                                    <button onClick={() => this.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
                
            </div>
        );
    }
}

export default App;