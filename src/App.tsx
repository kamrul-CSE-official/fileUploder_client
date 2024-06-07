import { FC, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const App: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/fileUpload",
        { formData, key: import.meta.env.KEY },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadedUrl(response.data.fileUrl);
        console.log("File uploaded successfully");
      } else {
        console.error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleCopyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      alert("File URL copied to clipboard");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <label htmlFor="file">Select File</label>
        <input type="file" name="file" id="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadedUrl && (
        <div>
          <p>File uploaded successfully. URL: {uploadedUrl}</p>
          <button onClick={handleCopyUrl}>Copy URL</button>
        </div>
      )}
    </div>
  );
};

export default App;
