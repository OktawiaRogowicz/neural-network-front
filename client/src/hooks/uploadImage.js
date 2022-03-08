import React from 'react';

async function upload(base64EncodedImage, categoryname) {
    var cn = "neural_" + categoryname;
    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({data: base64EncodedImage, name: cn}),
        headers: { 'Content-Type': 'application/json'},
      });
    } catch (error) {
      console.log(error);
    }
  }

export default function uploadImage(f, categoryname) {
    const reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onloadend = () => {
      upload(reader.result, categoryname);
    }
  }