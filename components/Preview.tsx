import React, { useState } from "react";
const fetch = require("node-fetch");
const previewStyles = require('../styles/Preview.module.scss');
let selectedFile: any;

export default function Preview() {
    let [upload, uploaded] = useState(false);

    function handleFileUpload(e: any) {
        selectedFile = e.target.files[0];
        uploaded(true);
        console.log(e.target.files);
        console.log(selectedFile);
    }
    
    async function handleFileSubmit(e: any) {
        console.log(selectedFile);
    
        const toBase64 = (file: any) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    
        let data = {
            requestedAPI: "saveImage",
            imageFile: await toBase64(selectedFile),
        };
    
        // console.log(JSON.stringify(data));
    
        await fetch("/api/endpoint", {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify(data),
            }).then(async (res: any) => {
        });
    }

    return (
        <div className={previewStyles.preview}>
            { !upload ? 
                (<label className={previewStyles.previewButtons}>
                    Upload File
                    <input 
                        type="file" 
                        id="myFile" 
                        name="filename" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e)}
                    />
                </label>)
                : 
                (<div>
                    Selected {selectedFile.name} 
                    <button onClick={(e) => handleFileSubmit(e)}>
                        Submit
                    </button>
                </div>)
            }
        </div>
    );
}