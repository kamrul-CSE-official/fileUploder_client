import { FC, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const App: FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/fileUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('File uploaded successfully');
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Select File</label>
        <input type="file" name="file" id="file" onChange={handleFileChange} />
        <input type="submit" value="Upload" />
      </form>
    </div>
  );
};

export default App;
