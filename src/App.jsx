import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image_url: '' });
  const [editBook, setEditBook] = useState(null);
  const uri = 'https://shiny-winner-9vqv7w4wjgpfp74j-5001.app.github.dev/';

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${uri}/books`);
      console.log("Fetched books:", response.data.books); // Debugging log
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error.response ? error.response.data : error.message);
      alert('Error fetching books: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleCreateBook = async () => {
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.image_url.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      const response = await axios.post(`${uri}/books`, newBook);
      console.log("Created book response:", response.data); // Debugging log

      // Update the state with the new book
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', image_url: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleEditBook = (book) => {
    console.log("Editing book:", book); // Debugging log
    setEditBook({ ...book });
  };

  const handleUpdateBook = async () => {
    if (!editBook.title.trim() || !editBook.author.trim() || !editBook.image_url.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    try {
      const response = await axios.put(`${uri}/books/${editBook.id}`, editBook);
      const updatedBooks = books.map((book) =>
        book.id === editBook.id ? response.data : book
      );
      setBooks(updatedBooks);
      setEditBook(null); // Clear edit mode
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${uri}/books/${bookId}`);
      const filteredBooks = books.filter((book) => book.id !== bookId);
      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className='test'>
      <h1>Book List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <input
                    type="text"
                    name="image_url"
                    value={editBook.image_url}
                    onChange={handleInputChange}
                  />
                ) : (
                  <img src={book.image_url} alt={book.title} width="50" />
                )}
              </td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editBook.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <input
                    type="text"
                    name="author"
                    value={editBook.author}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <button onClick={handleUpdateBook}>Update</button>
                ) : (
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                )}
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Add New Book</h1>
      <div className='input-books'>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={newBook.image_url}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateBook}>Create</button>
        <h2>กด Create แล้วต้อง รีเฟรช นะครับผมแก้ไม่เป็นว่ากดแล้วต้องโชว์เลยยังไง</h2>
      </div>
    </div>
  );
};

export default App;