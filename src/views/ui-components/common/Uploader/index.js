import React from 'react';
import {useDropzone} from 'react-dropzone';

export default function Uploader({onChange}) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    onDrop:async (acceptedFiles) => {
        onChange(acceptedFiles)
    }
  });
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <section
      className="container"
      style={{
        border: "1px solid #1948b3",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        marginTop: "1rem",
        color: "#1948b3",
      }}
    >
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  );
}