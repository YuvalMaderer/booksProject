document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('editButton');
    const saveButton = document.getElementById('saveButton');
    
    editButton.addEventListener('click', () => {
      // Get all <p> elements
      const paragraphs = document.querySelectorAll('p');
      
      // Convert each <p> element into an <input> element
      paragraphs.forEach(paragraph => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = paragraph.textContent;
        input.id = paragraph.id;
        paragraph.parentNode.replaceChild(input, paragraph);
      });
      
      // Toggle button visibility
      editButton.style.display = 'none';
      saveButton.style.display = 'inline';
    });
  
    saveButton.addEventListener('click', () => {
      // Get all <input> elements
      const inputs = document.querySelectorAll('input[type="text"]');
      
      // Convert each <input> element back to a <p> element
      inputs.forEach(input => {
        const paragraph = document.createElement('p');
        paragraph.textContent = input.value;
        paragraph.id = input.id;
        input.parentNode.replaceChild(paragraph, input);
      });
      
      // Toggle button visibility
      saveButton.style.display = 'none';
      editButton.style.display = 'inline';
    });
  });
  