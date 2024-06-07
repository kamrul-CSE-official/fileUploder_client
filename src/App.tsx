import { FC, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import "./App.css";

const App: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    formData.append("key", import.meta.env.VITE_IMAGE_UPLODE_KEY as string);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/fileUpload",
        formData,
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
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      alert("File URL copied to clipboard");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="file" className="label">
          Select File
        </label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleFileChange}
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {uploadedUrl && (
        <div className="result">
          <p>
            File uploaded successfully. URL:{" "}
            <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
              {uploadedUrl}
            </a>
          </p>
          <button onClick={handleCopyUrl} className="button">
            Copy URL
          </button>
          {/\.(jpg|jpeg|png)$/i.test(uploadedUrl) && (
            <img
              src={uploadedUrl}
              alt="Uploaded file"
              className="uploaded-image"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
