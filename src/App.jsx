import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFile(file);
  };
  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
          console.log(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  const uploadHandler = async (event) => {
    if(!fileDataURL){
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          base64: fileDataURL,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setData(data.newImageDoc);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="border w-full min-h-screen items-center flex gap-10 justify-center">
      <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden items-center">
        <div className="px-4 py-6">
          <div
            id="image-preview"
            className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer"
          >
            <input
              id="upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleInputChange}
            />
            <label htmlFor="upload" className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-gray-700 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                Upload picture
              </h5>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                Choose photo size should be less than{" "}
                <b className="text-gray-600">2mb</b>
              </p>
              <p className="font-normal text-sm text-gray-400 md:px-6">
                and should be in{" "}
                <b className="text-gray-600">JPG, PNG, or GIF</b> format.
              </p>
              <span
                id="filename"
                className="text-gray-500 bg-gray-200 z-50"
              ></span>
            </label>
            {file && <img src={fileDataURL} alt="image" />}
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full">
              <label className="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer">
                <button disabled={!fileDataURL} onClick={uploadHandler} className="text-center ml-2">
                  Extract text
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>
      {data && (
        <p className="flex-1">{data.textContent}</p>
      )}
    </section>
  );
}

export default App;
