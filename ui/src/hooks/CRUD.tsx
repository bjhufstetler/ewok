export const CRUD : Function = ({ method, path, data} : {method: string, path: string, data: any}) => {
    // method: POST, PATCH, DELETE
    const id = data.id ? data.id : '';
    delete(data['id']);
    const baseURL = 'http://localhost:8080/table?';
    console.log(method, path, data)
    fetch(`${baseURL}table=${path}&id=${id}`, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Cannot convert response to json');
        };
    });
};