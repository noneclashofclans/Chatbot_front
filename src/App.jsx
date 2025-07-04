import React, { useState } from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const App = () => {
  const [image, setImage] = useState(null);
  const [fileBuffer, setFileBuffer] = useState('');
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
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, JPEG, PNG, and HEIF images are allowed');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('File too large. Upload must be under 100MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setImage(file);
    e.target.value = null;

    try {
      const response = await fetch('https://chatbot-back-7rpl.vercel.app/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFileBuffer(data.fileBuffer);
        setFileType(data.fileType);
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

  console.log("Sending:", {
    prompt: value,
    fileBuffer: fileBuffer?.substring(0, 30),
    fileType: fileType
  });

  try {
    const response = await fetch('https://chatbot-back-11yn.vercel.app/gemini-analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: value,
        fileBuffer: fileBuffer,
        fileType: fileType
      }),
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
    setFileBuffer('');
    setFileType('');
  };

  return (
    <>
      <div className='app'>
        <section className='search-section'>
          <div className='image-container'>
            {image && <img src={URL.createObjectURL(image)} alt='uploaded' />}
          </div>

          <p className='extra-info'>
            <span>
              <label htmlFor="files" className='uploading'>Upload File
                <input type="file" id='files' accept=".jpg,.jpeg,.png,.heif,image/jpeg,image/png,image/heif" hidden onChange={uploadImage} />
              </label>
            </span>
          </p>

          <p className='ask'>What do you want to know about this image?</p>
          <div className='format-box'>
            <p className='format'>(Upload <strong>.jpeg, .jpg, .png, .heif</strong> under 100MB)</p>
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
          <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaLinkedin /> LinkedIn
          </a>
          {' | '}
          <a href="https://github.com/noneclashofclans" target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaGithub /> GitHub
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;
