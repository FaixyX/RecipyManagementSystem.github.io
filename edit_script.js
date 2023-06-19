// Function to handle the form submission for editing a recipe
function handleEditRecipeFormSubmit(event) {
    event.preventDefault();
  
    // Get the recipe ID from the URL
    const urlParts = window.location.href.split('/');
    const recipeId = urlParts[urlParts.length - 1];
  
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
  
    // Send a PUT request to update the recipe
    fetch(`/edit_recipe/${recipeId}`, {
      method: 'PUT',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Redirect to the recipe list page
          window.location.href = '/';
        }
      })
      .catch(error => console.log(error));
  }
  
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
  
  
  // Event listener for the form submission to edit a recipe
  document.getElementById('edit-recipe-form').addEventListener('submit', handleEditRecipeFormSubmit);
  
  // Event listener for image preview
  const imageInput = document.getElementById('image');
  imageInput.addEventListener('change', previewImage);
  