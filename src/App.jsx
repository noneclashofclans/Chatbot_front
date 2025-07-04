import React, { useState } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const App = () => {
  const [image, setImage] = useState(null);
  const [fileId, setFileId] = useState('');
  const [fileType, setFileType] = useState('');
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const randomValues = [
    'Does this image contain a cat?',
    'Is this the image of a dog?',
    'Is this a cool sports car?',
    'Does this image contain a fish?',
    'Does this image contain a horse?',
    'Does this image contain a car?',
    'Does this image contain a bike?',
  ];

  const giveAnswer = () => {
    const randomIndex = Math.floor(Math.random() * randomValues.length);
    setValue(randomValues[randomIndex]);
  };

  const uploadImage = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append('file', file);
    setImage(file);
    e.target.value = null;

    try {
      const response = await fetch('/https://chatbot-back-beta.vercel.app/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setFileId(data.fileId);
        setFileType(file.type);
        setError('');
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong during upload');
    }
  };

  const analyseImage = async () => {
    if (!image) return setError('Please upload an image first!');
    if (!value) return setError('Please enter a question');

    try {
      const response = await fetch('https://chatbot-back-beta.vercel.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: value, fileId, fileType }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        setResponse(data.reply);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong during analysis');
    }
  };

  const clearSection = () => {
    setValue('');
    setResponse('');
    setError('');
    setFileId('');
    // setImage(null);
    setFileType('');
  };

  return (
    <>
      <header>
        
      </header>

      <div className='app'>
        <section className='search-section'>
          <div className='image-container'>
            {image && <img src={URL.createObjectURL(image)} alt='uploaded' />}
          </div>

          <p className='extra-info'>
            <span>
              <label htmlFor="files" className='uploading'>Upload File
                <input type="file" id='files' accept='image/*' hidden onChange={uploadImage} />
              </label>
            </span>
          </p>

          <p className='ask'>What do you want to know about this image?</p>
          <div className='format-box'>
              <p className='format'>(Upload <strong>.jpeg or .jpg</strong> file types only)</p>
          </div>
          <button className='bunny-button' onClick={giveAnswer} disabled={response}>Guess...</button>

          <div className='input-container'>
            <input
              value={value}
              placeholder="What's present in this image?"
              className='input-sz'    
              onChange={e => setValue(e.target.value)}
            />
            {(!response && !error) && <button onClick={analyseImage}>Ask Bunny</button>}
            {(response || error) && <button onClick={clearSection}>Clear section</button>}
          </div>

          {error && <p className='error'>{error}</p>}
          {response && <p className='answer'>{response}</p>}
        </section>

      </div>

      <footer className="footer">
        <p className='ftcol'>© {new Date().getFullYear()} <strong>Bunny</strong> by Rishit Mohanty</p>
        <p className="social-links">
          <a
            href="https://www.linkedin.com/feed/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaLinkedin /> LinkedIn
          </a>
          {' | '}
          <a
            href="https://github.com/noneclashofclans"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaGithub /> GitHub
          </a>
        </p>
      </footer>

    </>
  );
};

export default App;
