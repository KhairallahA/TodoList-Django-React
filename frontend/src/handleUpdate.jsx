import React from 'react';
import App from './App';



const handleUpdate = e => {
    e.preventDefault();

    const csrftoken = this.getCookie('csrftoken');

    const url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`;

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

export default handleUpdate;