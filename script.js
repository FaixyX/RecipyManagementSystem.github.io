// Function to display the recipes
function displayRecipes() {
  // Get the recipe list element
  const recipeList = document.getElementById('recipes');

  // Clear the existing recipes
  recipeList.innerHTML = '';

  // Send a GET request to the server to fetch the recipes
  fetch('/get_recipes')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        data.recipes.forEach(recipe => {
          // Create a list item for each recipe
          const li = document.createElement('li');
          li.innerHTML = `
            <img src="static/images/${recipe[4]}" alt="${recipe[1]}" class="recipe-list-image">
            <h3>${recipe[1]}</h3>
            <p>${recipe[2]}</p>
            <p>${recipe[3]}</p>
            <button class="edit-button" onclick="editRecipe(${recipe[0]})">Edit</button>
            <button class="delete-button" onclick="deleteRecipe(${recipe[0]})">Delete</button>
          `;

          // Append the list item to the recipe list
          recipeList.appendChild(li);
        });
      }
    })
    .catch(error => console.log(error));
}

// Function to handle the form submission for adding a recipe
function handleAddRecipeFormSubmit(event) {
  event.preventDefault();

  // Get the form values
  const title = document.getElementById('title').value;
  const ingredients = document.getElementById('ingredients').value;
  const instructions = document.getElementById('instructions').value;
  const image = document.getElementById('image').files[0];

  // Create a FormData object to send the form data
  const formData = new FormData();
  formData.append('title', title);
  formData.append('ingredients', ingredients);
  formData.append('instructions', instructions);
  formData.append('image', image);

  // Send a POST request to add the recipe
  fetch('/add_recipe', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Clear the form values
        document.getElementById('title').value = '';
        document.getElementById('ingredients').value = '';
        document.getElementById('instructions').value = '';
        document.getElementById('image').value = '';

        // Display the updated recipe list
        displayRecipes();
      }
    })
    .catch(error => console.log(error));
}

// Function to handle the deletion of a recipe
function deleteRecipe(recipeId) {
  // Send a DELETE request to delete the recipe
  fetch(`/delete_recipe/${recipeId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Display the updated recipe list
        displayRecipes();
      }
    })
    .catch(error => console.log(error));
}

// Function to handle the editing of a recipe
function editRecipe(recipeId) {
  // Redirect to the edit recipe page
  window.location.href = `/edit_recipe/${recipeId}`;
}

// Event listener for the form submission to add a recipe
document.getElementById('add-recipe-form').addEventListener('submit', handleAddRecipeFormSubmit);

// Display the initial recipe list
displayRecipes();


// Function to preview the selected image
function previewImage() {
  const fileInput = document.getElementById('image');
  const previewContainer = document.getElementById('image-preview');
  const previewImage = previewContainer.querySelector('img');

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    previewImage.src = reader.result;
  });

  if (file) {
    reader.readAsDataURL(file);
  } else {
    previewImage.src = ''; // Clear the preview image
  }
}
