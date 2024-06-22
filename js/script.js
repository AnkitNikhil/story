document.addEventListener('DOMContentLoaded', () => {
    const storyForm = document.getElementById('story-form');
    const storiesContainer = document.getElementById('stories-container');
    let isUserDeveloper = false; // Default value, will be updated based on page and user action

    if (storyForm) {
        storyForm.addEventListener('submit', handleFormSubmit);
    }

    if (storiesContainer) {
        displayStories();
    }

    // Check if current page is read.html
    if (window.location.pathname.includes('read.html')) {
        isUserDeveloper = checkDeveloperStatus();
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();

        if (title && content) {
            const story = { title, content };
            saveStory(story);
            showAlert('Story submitted successfully!', 'success');
            storyForm.reset();
            displayStories();
        } else {
            showAlert('Please fill in both the title and content.', 'error');
        }
    }

    function saveStory(story) {
        try {
            const stories = JSON.parse(localStorage.getItem('stories')) || [];
            stories.push(story);
            localStorage.setItem('stories', JSON.stringify(stories));
        } catch (error) {
            console.error('Error saving the story:', error);
            showAlert('An error occurred while saving your story. Please try again.', 'error');
        }
    }

    function displayStories() {
        storiesContainer.innerHTML = ''; // Clear the container before displaying stories

        try {
            const stories = JSON.parse(localStorage.getItem('stories')) || [];
            if (stories.length === 0) {
                storiesContainer.innerHTML = '<p>No stories available. Be the first to write a story!</p>';
            } else {
                stories.forEach((story, index) => {
                    const storyElement = createStoryElement(story, index);
                    storiesContainer.appendChild(storyElement);
                });
            }
        } catch (error) {
            console.error('Error displaying stories:', error);
            storiesContainer.innerHTML = '<p>Unable to load stories. Please try again later.</p>';
        }
    }

    function createStoryElement(story, index) {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story');
        storyElement.innerHTML = `
            <h2>Story ${index + 1}: ${story.title}</h2>
            <p>${story.content}</p>
        `;
        storyElement.style.animation = 'fadeInUp 0.5s ease';

        // Use the stored developer status to conditionally display delete button
        if (isUserDeveloper) {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.dataset.index = index;
            deleteBtn.addEventListener('click', () => handleDelete(index));
            storyElement.appendChild(deleteBtn);
        }

        return storyElement;
    }

    function checkDeveloperStatus() {
        const wantToEnterUsername = confirm('Do you want to enter a username? Click "OK" to enter or "Cancel" to skip.');
        if (!wantToEnterUsername) return false;

        const username = prompt('Enter username:');
        if (!username || username.toLowerCase().trim() === '' || username.toLowerCase() === 'skip') return false;

        isUserDeveloper = username === 'admin61';
        displayStories(); // Call displayStories() here
        return isUserDeveloper;
    }

    function handleDelete(index) {
        if (confirm('Are you sure you want to delete this story?')) {
            const stories = JSON.parse(localStorage.getItem('stories')) || [];
            stories.splice(index, 1);
            localStorage.setItem('stories', JSON.stringify(stories));
            displayStories();
            showAlert('Story deleted successfully!', 'success');
        }
    }

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});

// Add the CSS for the alerts and animations:
const style = document.createElement('style');
style.textContent = `
.alert {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 1em;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    opacity: 0;
    animation: fadeInOut 3s ease;
}

.alert.success {
    background-color: green;
}

.alert.error {
    background-color: red;
}

@keyframes fadeInOut {
    0%, 100% {
        opacity: 0;
    }
    10%, 90% {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;
document.head.appendChild(style);
