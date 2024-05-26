
async function addToHistory(operation, bookId) {
  const historyItem = {
    operation: operation,
    time: new Date().toISOString(),
    bookId: bookId
  };

  try {
    await saveToHistory(historyEntry);
    console.log('History item added successfully.');
  } catch (error) {
    console.error('Error saving history item:', error.message);
  }
}

async function saveToHistory(historyItem) {
  try {
    const response = await axios.post('http://localhost:8001/history', historyItem);
    return response.data;
  } catch (error) {
    console.error('Error saving history item: ' + error.message);
  }
}

