import React from 'react'
import { Upload, Button } from 'components/ui'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { FcImageFile } from 'react-icons/fc'

const Customize = ({ setFile, onSubmit }) => {
  return (
    <div>
      <div>
        <Upload draggable onChange={(e) => setFile(e)}>
          <div className="my-16 text-center">
            <div className="text-6xl mb-4 flex justify-center">
              <FcImageFile />
            </div>
            <p className="font-semibold">
              <span className="text-gray-800 dark:text-white">
                Drop your image here, or{" "}
              </span>
              <span className="text-blue-500">browse</span>
            </p>
            <p className="mt-1 opacity-60 dark:text-white">
              Support: jpeg, png, gif
            </p>
          </div>
        </Upload>
      </div>
      <Button variant="solid" onClick={() => onSubmit()}>
        Upload
      </Button>
    </div>
  );
};

export default Customize
