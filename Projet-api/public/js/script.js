document.addEventListener('DOMContentLoaded', function () {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const taskFormTitle = document.getElementById('taskFormTitle');
    const taskFormElement = document.getElementById('taskFormElement');
    const cancelBtn = document.getElementById('cancelBtn');
    const taskList = document.getElementById('taskList');
    const taskDetail = document.getElementById('taskDetail');
    const closeDetailBtn = document.getElementById('closeDetailBtn');

    addTaskBtn.addEventListener('click', function () {
        taskForm.classList.remove('hidden');
        taskFormTitle.textContent = 'Ajouter une tâche';
        taskFormElement.removeAttribute('data-task-id');
        taskFormElement.reset();
    });

    cancelBtn.addEventListener('click', () => {
        taskForm.classList.add('hidden');
        taskFormElement.removeAttribute('data-task-id');
        taskFormElement.reset();
    });

    taskFormElement.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(taskFormElement);
        const taskData = {};
        formData.forEach((value, key) => {
            taskData[key] = value;
        });

        taskData['completed'] = formData.has('completed') ? '0' : '1';

        const taskId = taskFormElement.getAttribute('data-task-id');

        if (taskId) {
            // Si un ID de tâche est présent, il s'agit d'une modification
            updateTask(taskId, taskData);
        } else {
            // Sinon, il s'agit d'une création de nouvelle tâche
            createTask(taskData);
        }
    });

    function createTask(taskData) {
        fetch('../api/index.php', {
            method: 'POST',
            body: JSON.stringify(taskData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message) {
                console.log(data.message);
                taskFormElement.reset();
                taskForm.classList.add('hidden');
                fetchTaskList();
            } else {
                console.error('Erreur:', data.error);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }

    function fetchTaskList() {
        fetch('../api/index.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des tâches.');
            }
            return response.json();
        })
        .then(tasks => {
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.innerHTML = `
                <div class="detail">
                    <strong>Date:</strong> ${task.date} <br>
                    <strong>Description:</strong> ${task.description} <br>
                    <strong>Difficulté:</strong> ${task.difficulty} <br>
                    <strong>Terminée:</strong> ${task.completed === 0 ? 'Oui' : 'Non'} <br>
                    </div>
                    <button class="edit-btn" data-id="${task.id}">Modifier</button>
                    <button class="delete-btn" data-id="${task.id}">Supprimer</button>
                `;
                taskItem.querySelector('.detail').addEventListener('click', function () {
                    showTaskDetail(task);
                });
                taskItem.querySelector('.edit-btn').addEventListener('click', function () {
                    showEditForm(task);
                });
                taskItem.querySelector('.delete-btn').addEventListener('click', function () {
                    deleteTask(task.id);
                });
                taskList.appendChild(taskItem);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des tâches:', error));
    }

function showEditForm(task) {
    taskDetail.classList.add('hidden');
    taskForm.classList.remove('hidden');
    taskFormTitle.textContent = 'Modifier la tâche';
    taskFormElement.setAttribute('data-task-id', task.id);
    taskFormElement.date.value = task.date;
    taskFormElement.time.value = task.time;
    taskFormElement.description.value = task.description;
    taskFormElement.skills.value = task.skills;
    taskFormElement.comment.value = task.comment;
    taskFormElement.rating.value = task.rating;
    taskFormElement.difficulty.value = task.difficulty;
    taskFormElement.completed.checked = task.completed === 0; // Mettre à true si la valeur est '1'

    // Débogage pour afficher la valeur de task.completed
    console.log('Valeur de task.completed:', task.completed);
}

    
    function showTaskDetail(task) {
        taskForm.classList.add('hidden');
        taskDetail.innerHTML = `
            <h2>Détails de la Tâche</h2>
            <p><strong>Date:</strong> ${task.date}</p>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Temps:</strong> ${task.time} heures</p>
            <p><strong>Compétences:</strong> ${task.skills}</p>
            <p><strong>Commentaire:</strong> ${task.comment}</p>
            <p><strong>Note:</strong> ${task.rating}/4</p>
            <p><strong>Difficulté:</strong> ${task.difficulty}</p>
            <p><strong>Terminée:</strong> ${task.completed === 0 ? 'Oui' : 'Non'}</p> <!-- Modification de la condition -->
            <button id="closeDetailBtn">Fermer</button>
        `;
        taskDetail.classList.remove('hidden');
    
        const closeDetailBtn = document.getElementById('closeDetailBtn');
        closeDetailBtn.addEventListener('click', function () {
            taskDetail.classList.add('hidden');
        });
    }

    function deleteTask(taskId) {
        
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche?')) {
            fetch('../api/index.php?id=' + taskId, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message) {
                    console.log(data.message);
                    fetchTaskList(); // Rafraîchir la liste des tâches après la suppression
                } else {
                    console.error('Erreur:', data.error);
                }
            })
            .catch(error => console.error('Erreur:', error));
        }
    }

    closeDetailBtn.addEventListener('click', function () {
        taskDetail.classList.add('hidden');
    });

    function updateTask(taskId, taskData) {
        // Ajoutez ceci pour vérifier les données envoyées depuis le client
        console.log('Données envoyées depuis le client :', taskData);
    
        // Reste du code pour la mise à jour de la tâche
        fetch(`../api/index.php?id=`+ taskId, {
            method: 'PUT',
            body: JSON.stringify(taskData, { id: taskId }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.message) {
                console.log(data.message);
                taskFormElement.reset();
                taskForm.classList.add('hidden');
                fetchTaskList();
            } else {
                console.error('Erreur:', data.error);
            }
        })
        .catch(error => console.error('Erreur:', error));
    }

    fetchTaskList();
});