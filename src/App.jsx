import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Algunos archivos no son válidos.");
    }

    const newPreviews = validFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve({ src: reader.result, file, name: file.name });
      });
    });

    Promise.all(newPreviews).then((newFiles) => {
      setPreviews((prev) => [...prev, ...newFiles]);
      setFiles((prev) => [...prev, ...validFiles]);
    });
  }

  function removeFile(index) {
    setPreviews(previews.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
  }

  function openFilePicker() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  async function handleUpload() {
    if (files.length === 0) {
      toast.error("No hay archivos para enviar.");
      return;
    }
    
    for (const file of files) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function () {
        const rawLog = reader.result.split(",")[1];
        const dataSend = {
          dataReq: { data: rawLog, name: file.name, type: file.type },
          fname: "uploadFilesToGoogleDrive",
        };

        try {
          const response = await fetch(
            "https://script.google.com/macros/s/AKfycbxl-GLIcFbVI728JiPjj_inkPAMsVYAkzbgxtam78D7do9j5VUDaZ8HB0SMNqGRVqdCUg/exec",
            { method: "POST", body: JSON.stringify(dataSend) }
          );
          const result = await response.json();
          if (result.result && result.result.toLowerCase() === "success") {
            toast.success(`🎉 Archivo ${file.name} subido con éxito!`);
          } else {
            toast.error(`🚨 Error al subir ${file.name}: ${result.error || "Desconocido"}`);
          }
        } catch (e) {
          toast.error(`🚨 Error al subir ${file.name}. Ver consola para más detalles.`);
          console.error("Error en la subida de archivo:", e);
        }
      };
    }

    setPreviews([]);
    setFiles([]);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
      style={{ backgroundImage: "url('/party.jpg')" }}
    >
      <div
        className="bg-cover bg-center bg-no-repeat w-[80vh] h-[80vh] rounded-lg shadow-lg flex flex-col items-center justify-between py-6 relative"
        style={{ backgroundImage: "url('/fondofiesta.png')" }}
      >
        <h2 className="text-white text-2xl font-bold text-center mt-4">
          Carga tus fotos de la fiesta 🎉
        </h2>

        <div className="absolute top-[45%] left-[15%] w-[70%] h-[25%] flex flex-wrap gap-2 justify-center items-center p-3 rounded-lg transition-all duration-300">
          {previews.length > 0 ? (
            previews.map((preview, index) => (
              <div key={index} className="relative w-20 h-20 border-2 border-pink-500 rounded-lg overflow-hidden shadow-md group">
                <img src={preview.src} alt="Preview" className="w-full h-full object-cover" />
                <button
                  className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm"
                  onClick={() => removeFile(index)}
                >
                  ❌
                </button>
              </div>
            ))
          ) : (
            <p className="text-white text-center text-sm">No hay imágenes cargadas</p>
          )}
        </div>

        

        <button
          onClick={openFilePicker}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-110 transition-transform duration-300 absolute bottom-5"
        >
          📸 Seleccionar Imágenes
        </button>
        

        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {previews.length > 0 && (
          <button
            onClick={handleUpload}
            className="bg-green-500 text-white text-lg px-6 py-3 rounded-lg shadow-lg hover:scale-110 transition-transform duration-300 absolute bottom-16"
          >
            📤 Enviar Imágenes
          </button>
        )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
    
  );
}

export default App;