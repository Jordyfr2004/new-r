// Función para cargar usuarios desde localStorage
function loadUsers() {
    try {
        const data = JSON.parse(localStorage.getItem('usersData')) || { users: [] };
        displayUsers(data.users);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        displayUsers([]);
    }
}

// Función para mostrar usuarios en la lista
function displayUsers(users) {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'card mb-3';
        userDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">ID: ${user.id}</h5>
                <p class="card-text">Nombre: ${user.name}</p>
                <p class="card-text">Correo: ${user.email}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Eliminar</button>
                <button class="btn btn-warning btn-sm ms-2" onclick="editUser('${user.id}', '${user.name}', '${user.email}')">Editar</button>
            </div>
        `;
        usersList.appendChild(userDiv);
    });
}

// Función para generar ID único
function generateUniqueId(users) {
    if (users.length === 0) return '1';
    const lastUser = users[users.length - 1];
    return (parseInt(lastUser.id) + 1).toString();
}

// Función para editar usuario
function editUser(userId, currentName, currentEmail) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editName" value="${currentName}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Correo</label>
                            <input type="email" class="form-control" id="editEmail" value="${currentEmail}" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="saveEdit('${userId}')">Guardar</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Inicializar el modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Función para guardar cambios de edición
function saveEdit(userId) {
    try {
        const newName = document.getElementById('editName').value;
        const newEmail = document.getElementById('editEmail').value;

        // Obtener datos existentes
        let data = JSON.parse(localStorage.getItem('usersData')) || { users: [] };

        // Encontrar y actualizar el usuario
        const userIndex = data.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            data.users[userIndex] = { id: userId, name: newName, email: newEmail };

            // Guardar cambios en localStorage
            localStorage.setItem('usersData', JSON.stringify(data));

            // Recargar lista
            loadUsers();
        }

        // Cerrar modal
        const modal = document.querySelector('.modal');
        const bsModal = bootstrap.Modal.getInstance(modal);
        bsModal.hide();
        modal.remove();
    } catch (error) {
        console.error('Error al guardar cambios:', error);
        alert('Error al guardar cambios. Por favor, intenta de nuevo.');
    }
}

// Función para agregar nuevo usuario
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    try {
        // Obtener datos existentes
        let data = JSON.parse(localStorage.getItem('usersData')) || { users: [] };

        // Generar nuevo ID
        const id = generateUniqueId(data.users);

        // Agregar nuevo usuario
        data.users.push({ id, name, email });

        // Guardar cambios en localStorage
        localStorage.setItem('usersData', JSON.stringify(data));

        // Limpiar formulario
        e.target.reset();
        
        // Recargar lista
        loadUsers();
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('Error al agregar usuario. Por favor, intenta de nuevo.');
    }
});

// Función para eliminar usuario
function deleteUser(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    try {
        // Obtener datos existentes
        let data = JSON.parse(localStorage.getItem('usersData')) || { users: [] };

        // Eliminar usuario
        data.users = data.users.filter(user => user.id !== userId);

        // Guardar cambios en localStorage
        localStorage.setItem('usersData', JSON.stringify(data));

        // Recargar lista
        loadUsers();
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error al eliminar usuario. Por favor, intenta de nuevo.');
    }
}

// Cargar usuarios al iniciar
loadUsers();
