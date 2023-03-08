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
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()}/>
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  );
}