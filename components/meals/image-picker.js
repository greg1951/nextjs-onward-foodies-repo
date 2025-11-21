'use client';

import { useRef, useState } from 'react';
import styles from './image-picker.module.css';
import Image from 'next/image';

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(null);

  /* Ref will be used on the image input element to trigger our own click event */
  const imageRef = useRef();

  function uploadButtonHandler() {
    imageRef.current.click();
  }

  function imageChangeHandler(event) {
    const file = event.target.files[0];
    if (!file) {
      setPickedImage(null);
      return;
    }
    // const sz = (file.size / 1024 / 1000);
    // console.log(`${ sz } MB`);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
  }

  return (
    <div className={ styles.picker }>
      <label htmlFor={ name }>{ label }</label>
      <div className={ styles.controls }>
        <div className={ styles.preview }>
          { !pickedImage && <p>No picked image yet.</p> }
          { pickedImage && (
            <Image
              src={ pickedImage }
              alt={ name }
              fill
            />
          ) }
        </div>
        <input
          className={ styles.input } /* CSS class is display:none */
          type='file'
          id='image'
          name={ name }
          accept='image/png, image/jpeg'
          ref={ imageRef }
          onChange={ imageChangeHandler }
          required
        />
        <button type='button' className='button' onClick={ uploadButtonHandler }>
          Select an Image
        </button>
      </div>
    </div>
  );
}